<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;

class SampleBlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $teacher = User::where('uRole', 'teacher')->first();
        $category = Category::first();

        $authorId = $teacher ? $teacher->uId : 1;
        $categoryId = $category ? $category->caId : 1;

        Post::create([
            'pTitle'       => 'VSTEP là gì? Tất tần tật kiến thức cần biết trước kỳ thi 2025',
            'pContent'     => <<<HTML
<h2>VSTEP là gì?</h2>
<p><strong>VSTEP</strong> (Vietnamese Standardized Test of English Proficiency) là bài kiểm tra năng lực tiếng Anh chuẩn hóa quốc gia được Bộ Giáo dục và Đào tạo Việt Nam ban hành. Đây là chứng chỉ tiếng Anh duy nhất do Nhà nước cấp, được công nhận rộng rãi trong các cơ quan, doanh nghiệp và trường đại học trên toàn quốc.</p>

<p>Nhiều sinh viên và người đi làm nhầm lẫn VSTEP với IELTS hay TOEIC. Thực ra, VSTEP là chứng chỉ <em>nội địa</em> — có chi phí thấp hơn nhiều, phù hợp với nhu cầu xét tuyển đại học, thăng chức công chức và yêu cầu tốt nghiệp của nhiều trường.</p>

<h2>Cấu trúc đề thi VSTEP</h2>
<p>Bài thi VSTEP gồm <strong>4 kỹ năng</strong> chính, đánh giá toàn diện khả năng sử dụng tiếng Anh:</p>

<h3>1. Nghe (Listening) — 40 phút</h3>
<p>Phần thi Nghe có <strong>35 câu hỏi</strong> chia thành 3 phần:</p>
<ul>
  <li><strong>Part 1 — Announcements:</strong> 8 câu, nghe các thông báo ngắn (tin tức, quảng cáo, hướng dẫn). Mỗi đoạn phát 1 lần.</li>
  <li><strong>Part 2 — Conversations:</strong> 12 câu, nghe 6 đoạn hội thoại giữa 2 người. Mỗi đoạn có 2 câu hỏi trắc nghiệm.</li>
  <li><strong>Part 3 — Lectures/Talks:</strong> 15 câu, nghe 3 bài nói chuyên đề dài hơn. Mỗi bài có 5 câu hỏi, yêu cầu nắm bắt ý chính và chi tiết.</li>
</ul>
<p><em>Mẹo:</em> Đọc nhanh câu hỏi trước khi audio bắt đầu. Gạch chân keyword để tập trung khi nghe.</p>

<h3>2. Đọc (Reading) — 60 phút</h3>
<p>Phần Đọc gồm <strong>40 câu hỏi</strong> với 4 dạng bài:</p>
<ul>
  <li><strong>Part 1:</strong> Gap-fill — điền từ vào chỗ trống trong đoạn văn ngắn (từ vựng và ngữ pháp).</li>
  <li><strong>Part 2:</strong> True/False/Not Given — xác định thông tin dựa trên đoạn văn.</li>
  <li><strong>Part 3:</strong> Matching — nối thông tin với đoạn văn tương ứng.</li>
  <li><strong>Part 4:</strong> Multiple choice — câu hỏi trắc nghiệm về bài đọc dài (~600–800 từ).</li>
</ul>
<p><em>Mẹo:</em> Không đọc toàn bộ bài ngay. Hãy đọc câu hỏi trước, sau đó scan để tìm đoạn liên quan — tiết kiệm ít nhất 15 phút.</p>

<h3>3. Viết (Writing) — 60 phút</h3>
<p>Phần Viết gồm <strong>2 task</strong>:</p>
<ul>
  <li><strong>Task 1 (200 từ):</strong> Viết email/thư phản hồi dựa trên tình huống cho trước. Yêu cầu đủ 3 điểm: mở đầu, nội dung chính, lời kết.</li>
  <li><strong>Task 2 (250 từ):</strong> Viết bài luận trình bày quan điểm về một chủ đề xã hội. Đây là phần tính điểm cao nhất.</li>
</ul>
<p><em>Mẹo:</em> Dành 5 phút lập dàn ý cho Task 2 trước khi viết. Bài luận có cấu trúc rõ ràng (mở bài → 2 body paragraph → kết bài) thường đạt điểm cao hơn bài viết dài nhưng lộn xộn.</p>

<h3>4. Nói (Speaking) — 15 phút</h3>
<p>Phần Nói được thực hiện trực tiếp với giám khảo hoặc qua phần mềm thi trực tuyến:</p>
<ul>
  <li><strong>Part 1:</strong> Giới thiệu bản thân và trả lời câu hỏi về cuộc sống hàng ngày (3–4 phút).</li>
  <li><strong>Part 2:</strong> Đề xuất giải pháp cho tình huống thực tế (4–5 phút).</li>
  <li><strong>Part 3:</strong> Thảo luận về chủ đề rộng hơn, thể hiện khả năng lập luận (4–5 phút).</li>
</ul>

<h2>Thang điểm VSTEP và quy đổi CEFR</h2>
<p>VSTEP sử dụng thang điểm <strong>0–10</strong>, được quy đổi sang khung tham chiếu châu Âu (CEFR):</p>
<table>
  <thead><tr><th>Điểm VSTEP</th><th>Bậc CEFR</th><th>Ý nghĩa</th></tr></thead>
  <tbody>
    <tr><td>0–3.5</td><td>A1–A2</td><td>Cơ bản</td></tr>
    <tr><td>4.0–5.5</td><td>B1</td><td>Trung cấp</td></tr>
    <tr><td>6.0–7.5</td><td>B2</td><td>Trên trung cấp</td></tr>
    <tr><td>8.0–9.0</td><td>C1</td><td>Thành thạo</td></tr>
    <tr><td>9.5–10</td><td>C2</td><td>Thành thạo cao</td></tr>
  </tbody>
</table>
<p>Đa số trường đại học và cơ quan nhà nước yêu cầu <strong>VSTEP B2 (6.0+)</strong> để xét tốt nghiệp hoặc tuyển dụng.</p>

<h2>So sánh VSTEP với IELTS và TOEIC</h2>
<p>Nhiều người băn khoăn nên thi VSTEP hay IELTS. Dưới đây là tóm tắt nhanh:</p>
<ul>
  <li><strong>Chi phí:</strong> VSTEP ~600.000–1.200.000đ | IELTS ~4.700.000đ</li>
  <li><strong>Phạm vi công nhận:</strong> VSTEP trong nước | IELTS quốc tế</li>
  <li><strong>Mục tiêu:</strong> VSTEP cho xét tuyển ĐH, công chức VN | IELTS cho du học, visa nước ngoài</li>
  <li><strong>Độ khó:</strong> VSTEP B2 ≈ IELTS 5.5–6.0</li>
</ul>
<p>Nếu mục tiêu của bạn là <em>học trong nước hoặc làm việc tại Việt Nam</em>, VSTEP là lựa chọn kinh tế và thực tế hơn nhiều.</p>

<h2>Lộ trình ôn thi VSTEP B2 hiệu quả trong 3 tháng</h2>
<p>Dưới đây là lộ trình <strong>12 tuần</strong> được các giáo viên NamThuEdu đúc kết từ hàng trăm học viên đã đạt B2:</p>
<ol>
  <li><strong>Tuần 1–2:</strong> Chẩn đoán trình độ, ôn lại ngữ pháp nền (thì, mệnh đề, câu điều kiện).</li>
  <li><strong>Tuần 3–4:</strong> Tập trung kỹ năng Nghe — nghe thụ động 30 phút/ngày bằng podcast tiếng Anh đơn giản (BBC Learning English, VOA Slow English).</li>
  <li><strong>Tuần 5–6:</strong> Kỹ năng Đọc — luyện kỹ thuật scan và skim, làm 1 bài đọc mẫu/ngày.</li>
  <li><strong>Tuần 7–8:</strong> Kỹ năng Viết — học cấu trúc Task 1 (email) và Task 2 (essay). Viết ít nhất 3 bài/tuần và nhờ giáo viên chấm.</li>
  <li><strong>Tuần 9–10:</strong> Kỹ năng Nói — luyện nói 15 phút/ngày, tập phản xạ với các chủ đề quen thuộc (gia đình, công việc, môi trường).</li>
  <li><strong>Tuần 11–12:</strong> Thi thử full đề VSTEP, phân tích điểm yếu và hoàn thiện.</li>
</ol>

<h2>Tại sao chọn NamThuEdu để luyện thi VSTEP?</h2>
<p>Tại <strong>NamThuEdu</strong>, chúng tôi cung cấp:</p>
<ul>
  <li>Đề thi thử VSTEP đầy đủ 4 kỹ năng, cập nhật theo chuẩn mới nhất của Bộ GD&ĐT.</li>
  <li>Hệ thống chấm điểm tự động cho phần Nghe và Đọc — nhận kết quả ngay sau khi nộp bài.</li>
  <li>Giáo viên chấm và nhận xét chi tiết phần Viết và Nói trong vòng 24 giờ.</li>
  <li>Lộ trình học cá nhân hóa theo trình độ, mục tiêu và thời gian của từng học viên.</li>
</ul>
<p>Với hơn 3 năm đồng hành cùng học viên Cần Thơ và khu vực Đồng bằng sông Cửu Long, NamThuEdu tự hào là người bạn đồng hành đáng tin cậy trên hành trình chinh phục VSTEP B2 của bạn.</p>

<p><strong>Đăng ký tư vấn miễn phí</strong> ngay hôm nay để nhận lộ trình học phù hợp nhất với bạn!</p>
HTML,
            'pType'        => 'tips',
            'pCategory'    => $categoryId,
            'pUrl'         => 'vstep-la-gi-kien-thuc-can-biet-2025',
            'pThumbnail'   => '',
            'pAuthor_id'   => $authorId,
            'pStatus'      => 'active',
            'pView'        => 0,
            'pLike'        => 0,
            'pApproved_by' => $authorId,
            'pApproved_at' => now(),
        ]);

        $this->command->info('✅ Blog post seeded successfully!');
    }
}
