<?php

namespace App\Services;

use App\Models\Classes;
use App\Models\ClassEnrollment;
use App\Models\ClassTransfer;
use App\Models\User;
use App\Models\Course;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ClassManagementService
{
    /**
     * Bulk transfer students between classes with validation
     */
    public function bulkTransferStudents($fromClassId, $toClassId, $studentIds, $teacherId, $reason = null, $notes = null)
    {
        $results = [
            'success' => [],
            'errors' => [],
            'transferred_count' => 0,
        ];

        DB::beginTransaction();
        try {
            foreach ($studentIds as $studentId) {
                $result = $this->transferSingleStudent($fromClassId, $toClassId, $studentId, $teacherId, $reason, $notes);
                
                if ($result['success']) {
                    $results['success'][] = $result;
                    $results['transferred_count']++;
                } else {
                    $results['errors'][] = $result['error'];
                }
            }

            DB::commit();
            return $results;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk transfer failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Transfer a single student between classes
     */
    private function transferSingleStudent($fromClassId, $toClassId, $studentId, $teacherId, $reason, $notes)
    {
        // Validate student
        $student = User::where('uId', $studentId)
                      ->where('uRole', 'student')
                      ->whereNull('uDeleted_at')
                      ->first();

        if (!$student) {
            return [
                'success' => false,
                'error' => "Học viên ID {$studentId} không tồn tại hoặc không phải là học viên."
            ];
        }

        // Check enrollment in source class
        $fromEnrollment = ClassEnrollment::where('class_id', $fromClassId)
                                        ->where('student_id', $studentId)
                                        ->first();

        if (!$fromEnrollment) {
            return [
                'success' => false,
                'error' => "Học viên {$student->uName} không có trong lớp nguồn."
            ];
        }

        // Check if already in destination class
        $toEnrollment = ClassEnrollment::where('class_id', $toClassId)
                                      ->where('student_id', $studentId)
                                      ->exists();

        if ($toEnrollment) {
            return [
                'success' => false,
                'error' => "Học viên {$student->uName} đã có trong lớp đích."
            ];
        }

        // Perform transfer
        $fromEnrollment->delete();

        ClassEnrollment::create([
            'class_id' => $toClassId,
            'student_id' => $studentId,
        ]);

        ClassTransfer::create([
            'student_id' => $studentId,
            'from_class_id' => $fromClassId,
            'to_class_id' => $toClassId,
            'teacher_id' => $teacherId,
            'reason' => $reason,
            'notes' => $notes,
            'transferred_at' => now(),
        ]);

        return [
            'success' => true,
            'student_id' => $studentId,
            'student_name' => $student->uName,
        ];
    }

    /**
     * Bulk enroll students to a class
     */
    public function bulkEnrollStudents($classId, $studentIds)
    {
        $results = [
            'success' => [],
            'errors' => [],
            'enrolled_count' => 0,
        ];

        DB::beginTransaction();
        try {
            foreach ($studentIds as $studentId) {
                $result = $this->enrollSingleStudent($classId, $studentId);
                
                if ($result['success']) {
                    $results['success'][] = $result;
                    $results['enrolled_count']++;
                } else {
                    $results['errors'][] = $result['error'];
                }
            }

            DB::commit();
            return $results;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Bulk enrollment failed: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Enroll a single student to a class
     */
    private function enrollSingleStudent($classId, $studentId)
    {
        // Validate student
        $student = User::where('uId', $studentId)
                      ->where('uRole', 'student')
                      ->whereNull('uDeleted_at')
                      ->first();

        if (!$student) {
            return [
                'success' => false,
                'error' => "Học viên ID {$studentId} không tồn tại hoặc không phải là học viên."
            ];
        }

        // Check if already enrolled
        $exists = ClassEnrollment::where('class_id', $classId)
                                ->where('student_id', $studentId)
                                ->exists();

        if ($exists) {
            return [
                'success' => false,
                'error' => "Học viên {$student->uName} đã được ghi danh vào lớp này."
            ];
        }

        ClassEnrollment::create([
            'class_id' => $classId,
            'student_id' => $studentId,
        ]);

        return [
            'success' => true,
            'student_id' => $studentId,
            'student_name' => $student->uName,
        ];
    }

    /**
     * Get comprehensive class statistics for a teacher
     */
    public function getTeacherClassStatistics($teacherId)
    {
        $classes = Classes::where('cTeacher_id', $teacherId)->get();
        $classIds = $classes->pluck('cId');

        $totalStudents = ClassEnrollment::whereIn('class_id', $classIds)->count();
        $recentTransfers = ClassTransfer::where('teacher_id', $teacherId)
                                      ->where('transferred_at', '>=', now()->subDays(30))
                                      ->count();

        // Students per class
        $studentsPerClass = ClassEnrollment::whereIn('class_id', $classIds)
                                          ->select('class_id', DB::raw('count(*) as student_count'))
                                          ->groupBy('class_id')
                                          ->pluck('student_count', 'class_id');

        // Classes by course
        $classesByCourse = $classes->groupBy('course')->map(function($group) {
            return [
                'count' => $group->count(),
                'students' => $group->sum(function($class) {
                    return $class->getStudentCount();
                })
            ];
        });

        return [
            'total_classes' => $classes->count(),
            'active_classes' => $classes->where('cStatus', 'active')->count(),
            'inactive_classes' => $classes->where('cStatus', 'inactive')->count(),
            'total_students' => $totalStudents,
            'recent_transfers' => $recentTransfers,
            'average_students_per_class' => $classes->count() > 0 ? round($totalStudents / $classes->count(), 2) : 0,
            'classes_by_course' => $classesByCourse,
            'students_per_class' => $studentsPerClass,
        ];
    }

    /**
     * Validate class transfer business rules
     */
    public function validateTransfer($fromClassId, $toClassId, $teacherId)
    {
        $errors = [];

        // Check if classes exist and belong to teacher
        $fromClass = Classes::where('cId', $fromClassId)
                           ->where('cTeacher_id', $teacherId)
                           ->first();

        $toClass = Classes::where('cId', $toClassId)
                         ->where('cTeacher_id', $teacherId)
                         ->first();

        if (!$fromClass) {
            $errors[] = 'Lớp nguồn không tồn tại hoặc bạn không có quyền truy cập.';
        }

        if (!$toClass) {
            $errors[] = 'Lớp đích không tồn tại hoặc bạn không có quyền truy cập.';
        }

        if ($fromClassId == $toClassId) {
            $errors[] = 'Không thể chuyển học viên trong cùng một lớp.';
        }

        // Check if both classes are active
        if ($fromClass && $fromClass->cStatus !== 'active') {
            $errors[] = 'Lớp nguồn không ở trạng thái hoạt động.';
        }

        if ($toClass && $toClass->cStatus !== 'active') {
            $errors[] = 'Lớp đích không ở trạng thái hoạt động.';
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'from_class' => $fromClass,
            'to_class' => $toClass,
        ];
    }

    /**
     * Get transfer history with detailed information
     */
    public function getTransferHistory($classId, $days = 30)
    {
        $transfers = ClassTransfer::with(['student', 'fromClass', 'toClass', 'teacher'])
                                 ->where(function($query) use ($classId) {
                                     $query->where('from_class_id', $classId)
                                           ->orWhere('to_class_id', $classId);
                                 })
                                 ->where('transferred_at', '>=', now()->subDays($days))
                                 ->orderBy('transferred_at', 'desc')
                                 ->get();

        return [
            'transfers' => $transfers->map(function($transfer) use ($classId) {
                return [
                    'id' => $transfer->id,
                    'student' => [
                        'id' => $transfer->student->uId,
                        'name' => $transfer->student->uName,
                        'email' => $transfer->student->uEmail,
                    ],
                    'from_class' => [
                        'id' => $transfer->fromClass->cId,
                        'name' => $transfer->fromClass->cName,
                    ],
                    'to_class' => [
                        'id' => $transfer->toClass->cId,
                        'name' => $transfer->toClass->cName,
                    ],
                    'teacher' => [
                        'id' => $transfer->teacher->uId,
                        'name' => $transfer->teacher->uName,
                    ],
                    'reason' => $transfer->reason,
                    'notes' => $transfer->notes,
                    'transferred_at' => $transfer->transferred_at,
                    'direction' => $transfer->from_class_id == $classId ? 'outgoing' : 'incoming',
                ];
            }),
            'summary' => [
                'total_transfers' => $transfers->count(),
                'incoming' => $transfers->where('to_class_id', $classId)->count(),
                'outgoing' => $transfers->where('from_class_id', $classId)->count(),
                'period_days' => $days,
            ],
        ];
    }
}