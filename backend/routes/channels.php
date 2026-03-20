<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Submission;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Test session channel - chỉ student làm bài mới được join
Broadcast::channel('test-session.{submissionId}', function ($user, $submissionId) {
    // Kiểm tra submission thuộc về user này
    $submission = Submission::where('sId', $submissionId)
                           ->where('user_id', $user->uId)
                           ->where('sStatus', 'in_progress')
                           ->first();
    
    return $submission ? $user : false;
});

// Teacher monitoring channel - giáo viên có thể monitor các bài thi
Broadcast::channel('teacher-monitor.{teacherId}', function ($user, $teacherId) {
    return $user->uRole === 'teacher' && $user->uId == $teacherId;
});

// Class test monitoring - monitor tất cả bài thi của lớp
Broadcast::channel('class-test.{classId}', function ($user, $classId) {
    // Chỉ teacher hoặc student trong lớp mới được join
    if ($user->uRole === 'teacher') {
        return true;
    }
    
    if ($user->uRole === 'student') {
        return \App\Models\ClassEnrollment::where('class_id', $classId)
                                         ->where('student_id', $user->uId)
                                         ->exists();
    }
    
    return false;
});