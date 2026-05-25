<?php

namespace App\Http\Controllers;

use App\Models\ContributorAsset;
use App\Models\AssetMetadataHistory;
use App\Models\AssetKeyword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;

class ContributorAssetController extends Controller
{
    /**
     * Upload assets (bulk upload)
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required|array',
            'files.*' => 'required|file|mimes:jpeg,jpg,png,gif,svg,webp|max:20480', // 20MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contributorId = auth()->user()->uId;
        $uploadedAssets = [];

        DB::beginTransaction();
        try {
            foreach ($request->file('files') as $file) {
                // Generate unique filename
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = 'uploads/contributor_assets/' . $contributorId . '/' . $filename;

                // Store file
                $file->storeAs('public/' . dirname($path), basename($path));

                // Get image dimensions
                $imagePath = storage_path('app/public/' . $path);
                list($width, $height) = getimagesize($imagePath);

                // Create asset record
                $asset = ContributorAsset::create([
                    'contributor_id' => $contributorId,
                    'filename' => $file->getClientOriginalName(),
                    'file_path' => 'storage/' . $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'width' => $width,
                    'height' => $height,
                    'status' => 'draft',
                ]);

                $uploadedAssets[] = $asset;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($uploadedAssets) . ' assets uploaded successfully',
                'data' => $uploadedAssets
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all assets with filters
     */
    public function index(Request $request)
    {
        $contributorId = auth()->user()->uId;
        $perPage = $request->input('per_page', 20);
        $status = $request->input('status');
        $search = $request->input('search');

        $query = ContributorAsset::byContributor($contributorId)
            ->with(['contributor', 'reviewer']);

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('filename', 'like', "%{$search}%");
            });
        }

        $assets = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $assets
        ]);
    }

    /**
     * Get single asset
     */
    public function show($id)
    {
        $contributorId = auth()->user()->uId;

        $asset = ContributorAsset::byContributor($contributorId)
            ->with(['contributor', 'reviewer', 'metadataHistory'])
            ->find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $asset
        ]);
    }

    /**
     * Update asset metadata
     */
    public function updateMetadata(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:100',
            'category_1' => 'nullable|string|max:100',
            'category_2' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contributorId = auth()->user()->uId;
        $asset = ContributorAsset::byContributor($contributorId)->find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset not found'
            ], 404);
        }

        if (!$asset->canEdit()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot edit asset in current status'
            ], 403);
        }

        DB::beginTransaction();
        try {
            // Track changes
            $fields = ['title', 'description', 'category_1', 'category_2'];
            foreach ($fields as $field) {
                if ($request->has($field)) {
                    $oldValue = $asset->$field;
                    $newValue = $request->input($field);
                    
                    if ($oldValue !== $newValue) {
                        AssetMetadataHistory::logChange(
                            $asset->id,
                            $field,
                            $oldValue,
                            $newValue,
                            $contributorId
                        );
                    }
                }
            }

            // Handle keywords separately
            if ($request->has('keywords')) {
                $oldKeywords = $asset->keywords ?? [];
                $newKeywords = $request->input('keywords', []);
                
                if ($oldKeywords !== $newKeywords) {
                    AssetMetadataHistory::logChange(
                        $asset->id,
                        'keywords',
                        json_encode($oldKeywords),
                        json_encode($newKeywords),
                        $contributorId
                    );
                    
                    // Sync keywords table
                    AssetKeyword::syncKeywords($asset->id, $newKeywords);
                }
            }

            // Update asset
            $asset->update($request->only([
                'title',
                'description',
                'keywords',
                'category_1',
                'category_2'
            ]));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Metadata updated successfully',
                'data' => $asset->fresh()
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Update failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete draft asset
     */
    public function destroy($id)
    {
        $contributorId = auth()->user()->uId;
        $asset = ContributorAsset::byContributor($contributorId)->find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset not found'
            ], 404);
        }

        if (!$asset->canDelete()) {
            return response()->json([
                'success' => false,
                'message' => 'Only draft assets can be deleted'
            ], 403);
        }

        try {
            // Delete file from storage
            $filePath = str_replace('storage/', 'public/', $asset->file_path);
            Storage::delete($filePath);

            // Soft delete asset
            $asset->delete();

            return response()->json([
                'success' => true,
                'message' => 'Asset deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit asset for review
     */
    public function submit($id)
    {
        $contributorId = auth()->user()->uId;
        $asset = ContributorAsset::byContributor($contributorId)->find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset not found'
            ], 404);
        }

        if (!$asset->canSubmit()) {
            return response()->json([
                'success' => false,
                'message' => 'Asset cannot be submitted in current status'
            ], 403);
        }

        if ($asset->submit()) {
            return response()->json([
                'success' => true,
                'message' => 'Asset submitted for review',
                'data' => $asset->fresh()
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Submit failed'
        ], 500);
    }

    /**
     * Request removal of live asset
     */
    public function requestRemoval(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $contributorId = auth()->user()->uId;
        $asset = ContributorAsset::byContributor($contributorId)->find($id);

        if (!$asset) {
            return response()->json([
                'success' => false,
                'message' => 'Asset not found'
            ], 404);
        }

        if (!$asset->isLive()) {
            return response()->json([
                'success' => false,
                'message' => 'Only live assets can request removal'
            ], 403);
        }

        // TODO: Implement removal request logic (e.g., create a removal request record)
        // For now, just return success
        return response()->json([
            'success' => true,
            'message' => 'Removal request submitted successfully'
        ]);
    }

    /**
     * Get not submitted assets (draft)
     */
    public function notSubmitted(Request $request)
    {
        $contributorId = auth()->user()->uId;
        $perPage = $request->input('per_page', 20);

        $assets = ContributorAsset::byContributor($contributorId)
            ->draft()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $assets
        ]);
    }

    /**
     * Get marketplace catalog (approved/live)
     */
    public function marketplace(Request $request)
    {
        $contributorId = auth()->user()->uId;
        $perPage = $request->input('per_page', 20);

        $assets = ContributorAsset::byContributor($contributorId)
            ->approved()
            ->orderBy('approved_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $assets
        ]);
    }

    /**
     * Get pending review assets
     */
    public function pending(Request $request)
    {
        $contributorId = auth()->user()->uId;
        $perPage = $request->input('per_page', 20);

        $assets = ContributorAsset::byContributor($contributorId)
            ->pendingReview()
            ->orderBy('submitted_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $assets
        ]);
    }

    /**
     * Get rejected assets
     */
    public function rejected(Request $request)
    {
        $contributorId = auth()->user()->uId;
        $perPage = $request->input('per_page', 20);

        $assets = ContributorAsset::byContributor($contributorId)
            ->rejected()
            ->orderBy('reviewed_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $assets
        ]);
    }

    /**
     * Get contributor stats
     */
    public function stats()
    {
        $contributorId = auth()->user()->uId;

        $stats = [
            'total_assets' => ContributorAsset::byContributor($contributorId)->count(),
            'draft' => ContributorAsset::byContributor($contributorId)->draft()->count(),
            'pending_review' => ContributorAsset::byContributor($contributorId)->pendingReview()->count(),
            'approved' => ContributorAsset::byContributor($contributorId)->approved()->count(),
            'rejected' => ContributorAsset::byContributor($contributorId)->rejected()->count(),
            'total_views' => ContributorAsset::byContributor($contributorId)->sum('views_count'),
            'total_downloads' => ContributorAsset::byContributor($contributorId)->sum('downloads_count'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
