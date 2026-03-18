# 💬 Phân Tích Yêu Cầu Khách Hàng - Dạng Test Tiếng Anh

**Ngày**: 18/03/2026  
**Nguồn**: Tin nhắn khách hàng - Nam Bùi Louis  
**Yêu cầu**: Hỗ trợ nhiều dạng test tiếng Anh khác nhau  

---

## 📋 **YÊU CẦU TỪ KHÁCH HÀNG**

### 💬 **Tin nhắn khách hàng**:
> "Dừng rồi á em, bên anh luyện Cambridge: Starters, Movers, Flyers, KET, PET, FCE, CAE, IELTS và VSTEP với ôn phổ thông."

### 📊 **Danh sách test từ hình ảnh**:
1. **VSTEP** - Vietnamese Standardized Test
2. **IELTS** - International English Language Testing System  
3. **TOEIC S&W** - Speaking & Writing add-on
4. **IELTS** - Academic/General
5. **TOEFL iBT** - Internet-based Test
6. **Cambridge KET** - Key English Test (A2 Level)
7. **Cambridge PET** - Preliminary English Test (B1 Level)
8. **Cambridge FCE** - First Certificate in English (B2 Level)
9. **Cambridge CAE** - Certificate in Advanced English (C1 Level)
10. **Cambridge CPE** - Certificate of Proficiency in English (C2 Level)
11. **TOEIC Junior** - For younger learners
12. **APTIS** - British Council test
13. **PTE Academic** - Pearson Test of English
14. **Duolingo** - Online proficiency test
15. **SAT Subject** - Scholastic Assessment Test
16. **Oxford** - Oxford Test of English
17. **TOEFL Bridge** - Entry level
18. **VSTEP Essential** - Simplified version

---

## 🎯 **PHÂN TÍCH YÊ CẦU**

### **Cambridge English Tests (Ưu tiên cao)**
- **Starters** (Pre A1) - Trẻ em 6-8 tuổi
- **Movers** (A1) - Trẻ em 8-11 tuổi  
- **Flyers** (A2) - Trẻ em 9-12 tuổi
- **KET** (A2) - Key English Test
- **PET** (B1) - Preliminary English Test
- **FCE** (B2) - First Certificate in English
- **CAE** (C1) - Certificate in Advanced English

### **International Tests (Ưu tiên cao)**
- **IELTS** - Academic & General Training
- **VSTEP** - Vietnamese standard
- **TOEFL iBT** - Academic English
- **TOEIC** - Business English

### **Specialized Tests (Ưu tiên trung bình)**
- **PTE Academic** - Computer-based
- **APTIS** - British Council
- **Oxford Test** - Online assessment
- **Duolingo** - AI-powered test

---

## 💡 **Ý TƯỞNG PHÁT TRIỂN**

### **PHASE 1: Cambridge Young Learners (3-4 tháng)**
**Target**: Trẻ em 6-12 tuổi - Thị trường lớn tại VN

#### **1.1 Starters (Pre A1)**
```json
{
  "age_group": "6-8 years",
  "skills": ["listening", "reading", "speaking"],
  "format": {
    "listening": "20 minutes, pictures & colors",
    "reading": "20 minutes, words & pictures", 
    "speaking": "3-5 minutes, interactive"
  },
  "features": {
    "gamification": "High priority",
    "visual_content": "Pictures, colors, animations",
    "audio_quality": "Child-friendly voices"
  }
}
```

#### **1.2 Movers (A1)**
```json
{
  "age_group": "8-11 years",
  "skills": ["listening", "reading", "speaking"],
  "format": {
    "listening": "25 minutes, stories & conversations",
    "reading": "30 minutes, short texts",
    "speaking": "5-7 minutes, picture stories"
  }
}
```

#### **1.3 Flyers (A2)**
```json
{
  "age_group": "9-12 years", 
  "skills": ["listening", "reading", "speaking"],
  "format": {
    "listening": "25 minutes, conversations & monologues",
    "reading": "40 minutes, texts & stories",
    "speaking": "7-9 minutes, discussions"
  }
}
```

### **PHASE 2: Cambridge Main Suite (4-5 tháng)**
**Target**: Học sinh, sinh viên, người đi làm

#### **2.1 KET (A2)**
```json
{
  "duration": "110 minutes",
  "parts": {
    "reading_writing": "60 minutes",
    "listening": "30 minutes", 
    "speaking": "8-10 minutes"
  }
}
```

#### **2.2 PET (B1)**
```json
{
  "duration": "140 minutes",
  "parts": {
    "reading": "45 minutes",
    "writing": "45 minutes",
    "listening": "30 minutes",
    "speaking": "12-17 minutes"
  }
}
```

#### **2.3 FCE (B2)**
```json
{
  "duration": "209 minutes",
  "parts": {
    "reading_use_of_english": "75 minutes",
    "writing": "80 minutes", 
    "listening": "40 minutes",
    "speaking": "14 minutes"
  }
}
```

#### **2.4 CAE (C1)**
```json
{
  "duration": "235 minutes",
  "parts": {
    "reading_use_of_english": "90 minutes",
    "writing": "90 minutes",
    "listening": "40 minutes", 
    "speaking": "15 minutes"
  }
}
```

### **PHASE 3: Specialized Tests (3-4 tháng)**

#### **3.1 TOEFL iBT Enhancement**
- Academic reading passages
- Integrated writing tasks
- Academic speaking tasks
- Note-taking features

#### **3.2 PTE Academic**
- Computer-based interface
- AI scoring simulation
- Integrated skills tasks
- Real-time feedback

#### **3.3 APTIS (British Council)**
- Modular test structure
- Tailored skill combinations
- Business/Academic variants

---

## 🛠️ **TECHNICAL IMPLEMENTATION**

### **Database Schema Extensions**

#### **Test Types Table**
```sql
CREATE TABLE test_types (
    id BIGINT PRIMARY KEY,
    code VARCHAR(20) UNIQUE, -- 'STARTERS', 'MOVERS', 'KET', etc.
    name VARCHAR(100),
    category ENUM('cambridge_young', 'cambridge_main', 'international', 'specialized'),
    level ENUM('pre_a1', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'),
    age_group VARCHAR(20), -- '6-8', '8-11', 'adult', etc.
    duration_minutes INT,
    skills JSON, -- ['listening', 'reading', 'writing', 'speaking']
    format_config JSON,
    is_active BOOLEAN DEFAULT true
);
```

#### **Test Sections Table**
```sql
CREATE TABLE test_sections (
    id BIGINT PRIMARY KEY,
    test_type_id BIGINT,
    section_name VARCHAR(50), -- 'Part 1', 'Reading', etc.
    section_order INT,
    duration_minutes INT,
    question_count INT,
    instructions TEXT,
    section_config JSON
);
```

#### **Question Templates Table**
```sql
CREATE TABLE question_templates (
    id BIGINT PRIMARY KEY,
    test_type_id BIGINT,
    section_id BIGINT,
    template_name VARCHAR(100),
    question_type ENUM('multiple_choice', 'fill_blank', 'matching', 'speaking', 'writing'),
    template_config JSON,
    sample_question JSON
);
```

### **New API Endpoints**

#### **Test Types Management**
```php
GET /api/teacher/test-types
GET /api/teacher/test-types/{category}
POST /api/teacher/exams/from-template/{testTypeId}
GET /api/teacher/test-types/{id}/sections
```

#### **Cambridge Young Learners**
```php
GET /api/teacher/cambridge/young-learners
POST /api/teacher/exams/cambridge/starters
POST /api/teacher/exams/cambridge/movers  
POST /api/teacher/exams/cambridge/flyers
```

#### **Cambridge Main Suite**
```php
POST /api/teacher/exams/cambridge/ket
POST /api/teacher/exams/cambridge/pet
POST /api/teacher/exams/cambridge/fce
POST /api/teacher/exams/cambridge/cae
```

#### **Student Experience**
```php
GET /api/student/test-types/available
GET /api/student/tests/cambridge/{level}
POST /api/student/tests/cambridge/{testId}/start
```

---

## 🎨 **UX/UI CONSIDERATIONS**

### **For Young Learners (Starters/Movers/Flyers)**
- **Colorful, playful interface**
- **Large buttons and text**
- **Audio instructions in Vietnamese**
- **Progress indicators with fun animations**
- **Reward system (stars, badges)**
- **Parent dashboard for progress tracking**

### **For Adult Learners (KET/PET/FCE/CAE)**
- **Professional, clean interface**
- **Exam-like environment simulation**
- **Timer with warnings**
- **Note-taking tools (for TOEFL/PTE)**
- **Practice mode vs Exam mode**
- **Detailed performance analytics**

---

## 📊 **BUSINESS IMPACT**

### **Market Expansion**
- **Young Learners Market**: 500K+ students (6-12 tuổi)
- **Cambridge Certificates**: 200K+ candidates/year
- **International Tests**: 100K+ test takers
- **Premium Pricing**: Cambridge tests command higher fees

### **Revenue Potential**
```
Young Learners: 500K × $20 = $10M potential
Cambridge Main: 200K × $50 = $10M potential  
International: 100K × $30 = $3M potential
Total Addressable Market: $23M
```

### **Competitive Advantage**
- **First comprehensive Cambridge platform in VN**
- **Age-appropriate interfaces**
- **Real exam simulation**
- **Vietnamese language support**

---

## 🚀 **IMPLEMENTATION ROADMAP**

### **Month 1-2: Foundation**
- Database schema design
- Test type configuration system
- Basic template engine

### **Month 3-4: Young Learners**
- Starters implementation
- Movers implementation  
- Flyers implementation
- Kid-friendly UI/UX

### **Month 5-6: KET & PET**
- A2/B1 level implementation
- Speaking test simulation
- Writing assessment tools

### **Month 7-8: FCE & CAE**
- B2/C1 level implementation
- Advanced question types
- Integrated skills tasks

### **Month 9-10: Specialized Tests**
- TOEFL iBT enhancements
- PTE Academic features
- APTIS implementation

### **Month 11-12: Polish & Launch**
- Performance optimization
- User testing & feedback
- Marketing campaign
- Teacher training

---

## 🎯 **SUCCESS METRICS**

### **Technical KPIs**
- **Test Types Supported**: 15+ formats
- **Question Bank Size**: 10,000+ questions
- **User Experience**: <2s load time
- **Accuracy**: 95%+ scoring precision

### **Business KPIs**
- **User Acquisition**: 50K+ students in Year 1
- **Revenue Growth**: $2M+ in Year 1
- **Market Share**: 30% of Cambridge test prep market
- **Customer Satisfaction**: 4.5+ stars

---

## 💡 **CONCLUSION & NEXT STEPS**

### **Immediate Actions**
1. **Validate with client** - Confirm priority test types
2. **Market research** - Analyze competitor offerings
3. **Technical planning** - Detailed architecture design
4. **Team expansion** - Hire Cambridge-certified content creators

### **Strategic Focus**
- **Start with Young Learners** - Highest market potential
- **Quality over quantity** - Perfect each test type
- **Local adaptation** - Vietnamese context and culture
- **Scalable architecture** - Easy to add new test types

**🚀 This expansion could position NamThu Education as the leading Cambridge English test preparation platform in Vietnam!**