<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamHighlight;
use App\Models\ExamVocabNote;

class ExamHighlightController extends Controller
{
    public function getHighlights(Request $request, $examId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $part = $request->query('part');

        $query = ExamHighlight::where('user_id', $user->uId)
            ->where('exam_id', $examId);

        if ($part !== null) {
            $query->where('part_number', (int) $part);
        }

        $highlights = $query->orderBy('start_offset')->get();

        return response()->json(['status' => 'success', 'data' => $highlights]);
    }

    public function saveHighlight(Request $request, $examId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $request->validate([
            'skill'         => 'required|string|max:20',
            'part_number'   => 'required|integer|min:1',
            'start_offset'  => 'required|integer|min:0',
            'end_offset'    => 'required|integer|min:0',
            'color'         => 'required|string|max:20',
            'selected_text' => 'required|string|max:2000',
        ]);

        $highlight = ExamHighlight::create([
            'user_id'       => $user->uId,
            'exam_id'       => $examId,
            'skill'         => $request->skill,
            'part_number'   => $request->part_number,
            'start_offset'  => $request->start_offset,
            'end_offset'    => $request->end_offset,
            'color'         => $request->color,
            'selected_text' => $request->selected_text,
        ]);

        return response()->json(['status' => 'success', 'data' => $highlight], 201);
    }

    public function deleteHighlight(Request $request, $examId, $highlightId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $highlight = ExamHighlight::where('id', $highlightId)
            ->where('user_id', $user->uId)
            ->where('exam_id', $examId)
            ->first();

        if (!$highlight) {
            return response()->json(['status' => 'error', 'message' => 'Not found.'], 404);
        }

        $highlight->delete();

        return response()->json(['status' => 'success']);
    }

    public function getVocab(Request $request, $examId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $vocab = ExamVocabNote::where('user_id', $user->uId)
            ->where('exam_id', $examId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $vocab]);
    }

    public function saveVocab(Request $request, $examId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $request->validate([
            'word'    => 'required|string|max:500',
            'context' => 'nullable|string|max:1000',
        ]);

        $vocab = ExamVocabNote::updateOrCreate(
            [
                'user_id' => $user->uId,
                'exam_id' => $examId,
                'word'    => trim($request->word),
            ],
            [
                'context' => $request->context,
            ]
        );

        return response()->json(['status' => 'success', 'data' => $vocab], 201);
    }

    public function deleteVocab(Request $request, $examId, $vocabId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 401);
        }

        $vocab = ExamVocabNote::where('id', $vocabId)
            ->where('user_id', $user->uId)
            ->where('exam_id', $examId)
            ->first();

        if (!$vocab) {
            return response()->json(['status' => 'error', 'message' => 'Not found.'], 404);
        }

        $vocab->delete();

        return response()->json(['status' => 'success']);
    }
}
