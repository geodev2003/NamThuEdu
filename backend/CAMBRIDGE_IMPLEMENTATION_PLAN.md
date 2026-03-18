# 🎯 Kế Hoạch Implementation - Cambridge Test System

**Ngày**: 18/03/2026  
**Yêu cầu khách hàng**: Hỗ trợ Cambridge Starters, Movers, Flyers, KET, PET, FCE, CAE + IELTS + VSTEP  
**Timeline**: 4 tháng (Phase 1-2)  

---

## 📋 **PHASE 1: EXAM TEMPLATES SYSTEM (Tháng 1-2)**

### **1.1 Database Schema Extensions**

#### **Exam Templates Table**
```sql
CREATE TABLE exam_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_code VARCHAR(20) UNIQUE, -- 'STARTERS', 'MOVERS', 'KET', etc.
    template_name VARCHAR(100),
    category ENUM('cambridge_young', 'cambridge_main', 'international'),
    level ENUM('pre_a1', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'),
    age_group VARCHAR(20), -- '6-8', '8-11', 'adult'
    total_duration_minutes INT,
    skills JSON, -- ['listening', 'reading', 'writing', 'speaking']
    sections JSON, -- Template structure
    instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Template Sections Table**
```sql
CREATE TABLE template_sections (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_id BIGINT,
    section_name VARCHAR(50), -- 'Part 1', 'Reading', etc.
    section_order INT,
    duration_minutes INT,
    question_count INT,
    question_types JSON, -- ['multiple_choice', 'fill_blank', etc.]
    instructions TEXT,
    section_config JSON,
    FOREIGN KEY (template_id) REFERENCES exam_templates(id)
);
```

### **1.2 Cambridge Young Learners Templates**

#### **Starters (Pre A1) - Ages 6-8**
```json
{
  "template_code": "STARTERS",
  "template_name": "Cambridge English Starters",
  "category": "cambridge_young",
  "level": "pre_a1",
  "age_group": "6-8",
  "total_duration_minutes": 45,
  "skills": ["listening", "reading", "speaking"],
  "sections": [
    {
      "name": "Listening",
      "duration": 20,
      "parts": [
        {
          "part": 1,
          "name": "Listen and draw lines",
          "questions": 5,
          "type": "matching_lines"
        },
        {
          "part": 2, 
          "name": "Listen and write",
          "questions": 5,
          "type": "fill_blank"
        },
        {
          "part": 3,
          "name": "Listen and tick",
          "questions": 5,
          "type": "multiple_choice"
        },
        {
          "part": 4,
          "name": "Listen and colour",
          "questions": 5,
          "type": "coloring"
        }
      ]
    },
    {
      "name": "Reading and Writing",
      "duration": 20,
      "parts": [
        {
          "part": 1,
          "name": "Look and read",
          "questions": 5,
          "type": "true_false"
        },
        {
          "part": 2,
          "name": "Look and read",
          "questions": 6,
          "type": "multiple_choice"
        },
        {
          "part": 3,
          "name": "Look at the pictures",
          "questions": 5,
          "type": "fill_blank"
        },
        {
          "part": 4,
          "name": "Read this",
          "questions": 5,
          "type": "multiple_choice"
        },
        {
          "part": 5,
          "name": "Look at the picture",
          "questions": 3,
          "type": "short_answer"
        }
      ]
    },
    {
      "name": "Speaking",
      "duration": 5,
      "parts": [
        {
          "part": 1,
          "name": "What's this?",
          "questions": 5,
          "type": "speaking_identification"
        },
        {
          "part": 2,
          "name": "Find the differences",
          "questions": 4,
          "type": "speaking_comparison"
        }
      ]
    }
  ]
}
```

#### **Movers (A1) - Ages 8-11**
```json
{
  "template_code": "MOVERS",
  "template_name": "Cambridge English Movers", 
  "category": "cambridge_young",
  "level": "a1",
  "age_group": "8-11",
  "total_duration_minutes": 62,
  "sections": [
    {
      "name": "Listening",
      "duration": 25,
      "questions": 25
    },
    {
      "name": "Reading and Writing", 
      "duration": 30,
      "questions": 35
    },
    {
      "name": "Speaking",
      "duration": 7,
      "questions": 4
    }
  ]
}
```

#### **Flyers (A2) - Ages 9-12**
```json
{
  "template_code": "FLYERS",
  "template_name": "Cambridge English Flyers",
  "category": "cambridge_young", 
  "level": "a2",
  "age_group": "9-12",
  "total_duration_minutes": 72,
  "sections": [
    {
      "name": "Listening",
      "duration": 25,
      "questions": 25
    },
    {
      "name": "Reading and Writing",
      "duration": 40, 
      "questions": 44
    },
    {
      "name": "Speaking",
      "duration": 9,
      "questions": 4
    }
  ]
}
```

### **1.3 Cambridge Main Suite Templates**

#### **KET (A2) - Key English Test**
```json
{
  "template_code": "KET",
  "template_name": "Cambridge English Key (KET)",
  "category": "cambridge_main",
  "level": "a2", 
  "age_group": "adult",
  "total_duration_minutes": 110,
  "sections": [
    {
      "name": "Reading and Writing",
      "duration": 60,
      "parts": [
        {
          "part": 1,
          "name": "Multiple choice",
          "questions": 6,
          "type": "multiple_choice"
        },
        {
          "part": 2,
          "name": "Matching",
          "questions": 7,
          "type": "matching"
        },
        {
          "part": 3,
          "name": "Multiple choice",
          "questions": 8,
          "type": "multiple_choice"
        },
        {
          "part": 4,
          "name": "Right or Wrong",
          "questions": 7,
          "type": "true_false"
        },
        {
          "part": 5,
          "name": "Multiple choice cloze",
          "questions": 8,
          "type": "multiple_choice_cloze"
        },
        {
          "part": 6,
          "name": "Word completion",
          "questions": 5,
          "type": "word_completion"
        },
        {
          "part": 7,
          "name": "Open cloze",
          "questions": 10,
          "type": "open_cloze"
        },
        {
          "part": 8,
          "name": "Information transfer",
          "questions": 5,
          "type": "information_transfer"
        },
        {
          "part": 9,
          "name": "Short message",
          "questions": 1,
          "type": "short_writing"
        }
      ]
    },
    {
      "name": "Listening",
      "duration": 30,
      "questions": 25
    },
    {
      "name": "Speaking",
      "duration": 10,
      "questions": 2
    }
  ]
}
```

#### **PET (B1) - Preliminary English Test**
```json
{
  "template_code": "PET",
  "template_name": "Cambridge English Preliminary (PET)",
  "category": "cambridge_main",
  "level": "b1",
  "total_duration_minutes": 140
}
```

#### **FCE (B2) - First Certificate in English**
```json
{
  "template_code": "FCE", 
  "template_name": "Cambridge English First (FCE)",
  "category": "cambridge_main",
  "level": "b2",
  "total_duration_minutes": 209
}
```

#### **CAE (C1) - Certificate in Advanced English**
```json
{
  "template_code": "CAE",
  "template_name": "Cambridge English Advanced (CAE)", 
  "category": "cambridge_main",
  "level": "c1",
  "total_duration_minutes": 235
}
```

---

## 🛠️ **IMPLEMENTATION TASKS**

### **Week 1-2: Database & Models**
- [ ] Create migration for `exam_templates` table
- [ ] Create migration for `template_sections` table  
- [ ] Create `ExamTemplate` model
- [ ] Create `TemplateSection` model
- [ ] Seed Cambridge templates data

### **Week 3-4: Template APIs**
- [ ] `GET /api/teacher/exam-templates` - List all templates
- [ ] `GET /api/teacher/exam-templates/{category}` - Templates by category
- [ ] `GET /api/teacher/exam-templates/{id}` - Template details
- [ ] `POST /api/teacher/exams/from-template/{templateId}` - Create exam from template
- [ ] `GET /api/teacher/exam-templates/{id}/sections` - Template sections

### **Week 5-6: Question Types Extension**
- [ ] Extend Question model for new question types
- [ ] Add validation for different question types
- [ ] Update ExamController to handle new types
- [ ] Create question type handlers

### **Week 7-8: UI Integration & Testing**
- [ ] Template selection interface
- [ ] Exam creation from template
- [ ] Question type interfaces
- [ ] End-to-end testing
- [ ] Performance optimization

---

## 📊 **EXPECTED OUTCOMES**

### **After Phase 1 Completion**:
- ✅ **8 Cambridge Templates**: Starters, Movers, Flyers, KET, PET, FCE, CAE + Enhanced IELTS
- ✅ **Template-based Exam Creation**: Giáo viên tạo đề từ template chuẩn
- ✅ **Multiple Question Types**: 10+ dạng câu hỏi khác nhau
- ✅ **Age-appropriate Interfaces**: UI phù hợp từng độ tuổi
- ✅ **Structured Exam Format**: Đúng format Cambridge chuẩn

### **Business Impact**:
- **Market Expansion**: Tiếp cận 500K+ học sinh Cambridge
- **Premium Pricing**: Cambridge tests có giá cao hơn 2-3 lần
- **Competitive Advantage**: Platform Cambridge đầu tiên tại VN
- **Revenue Potential**: $10M+ addressable market

---

## 🎯 **SUCCESS METRICS**

### **Technical KPIs**:
- **Template Coverage**: 8/8 Cambridge formats
- **Question Types**: 10+ supported types  
- **Exam Creation Time**: <5 minutes from template
- **System Performance**: <2s load time

### **Business KPIs**:
- **Teacher Adoption**: 80%+ teachers use templates
- **Exam Quality**: 95%+ format accuracy
- **User Satisfaction**: 4.5+ stars
- **Revenue Growth**: 200%+ increase

**🚀 Phase 1 sẽ đặt nền móng vững chắc cho hệ thống Cambridge Test toàn diện!**