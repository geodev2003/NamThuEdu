import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../components/Header";
import { Search, Clock, Users, FileText, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

// Template data structure - translations come from i18n
const getTemplates = (t: any) => [
  {
    id: 1,
    category: "youngLearners",
    templateKey: "starters",
    name: t('cambridgeTemplates.templates.starters.name'),
    fullName: t('cambridgeTemplates.templates.starters.fullName'),
    level: t('cambridgeTemplates.templates.starters.level'),
    age: t('cambridgeTemplates.templates.starters.age'),
    duration: "45",
    questions: "54",
    borderColor: "#10B981",
    badgeColor: "#10B981",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "20" },
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "20" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "5" },
    ],
    description: t('cambridgeTemplates.templates.starters.description'),
  },
  {
    id: 2,
    category: "youngLearners",
    templateKey: "movers",
    name: t('cambridgeTemplates.templates.movers.name'),
    fullName: t('cambridgeTemplates.templates.movers.fullName'),
    level: t('cambridgeTemplates.templates.movers.level'),
    age: t('cambridgeTemplates.templates.movers.age'),
    duration: "65",
    questions: "73",
    borderColor: "#2563EB",
    badgeColor: "#2563EB",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "25" },
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "30" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "7" },
    ],
    description: t('cambridgeTemplates.templates.movers.description'),
  },
  {
    id: 3,
    category: "youngLearners",
    templateKey: "flyers",
    name: t('cambridgeTemplates.templates.flyers.name'),
    fullName: t('cambridgeTemplates.templates.flyers.fullName'),
    level: t('cambridgeTemplates.templates.flyers.level'),
    age: t('cambridgeTemplates.templates.flyers.age'),
    duration: "75",
    questions: "84",
    borderColor: "#8B5CF6",
    badgeColor: "#8B5CF6",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "25" },
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "40" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "9" },
    ],
    description: t('cambridgeTemplates.templates.flyers.description'),
  },
  {
    id: 4,
    category: "mainSuite",
    templateKey: "ket",
    name: t('cambridgeTemplates.templates.ket.name'),
    fullName: t('cambridgeTemplates.templates.ket.fullName'),
    level: t('cambridgeTemplates.templates.ket.level'),
    age: t('cambridgeTemplates.templates.ket.age'),
    duration: "110",
    questions: "83",
    borderColor: "#F59E0B",
    badgeColor: "#F59E0B",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "60" },
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "30" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "10" },
    ],
    description: t('cambridgeTemplates.templates.ket.description'),
  },
  {
    id: 5,
    category: "mainSuite",
    templateKey: "pet",
    name: t('cambridgeTemplates.templates.pet.name'),
    fullName: t('cambridgeTemplates.templates.pet.fullName'),
    level: t('cambridgeTemplates.templates.pet.level'),
    age: t('cambridgeTemplates.templates.pet.age'),
    duration: "140",
    questions: "95",
    borderColor: "#14B8A6",
    badgeColor: "#14B8A6",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "45" },
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "45" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "30" },
    ],
    description: t('cambridgeTemplates.templates.pet.description'),
  },
  {
    id: 6,
    category: "mainSuite",
    templateKey: "fce",
    name: t('cambridgeTemplates.templates.fce.name'),
    fullName: t('cambridgeTemplates.templates.fce.fullName'),
    level: t('cambridgeTemplates.templates.fce.level'),
    age: t('cambridgeTemplates.templates.fce.age'),
    duration: "209",
    questions: "100+",
    borderColor: "#2563EB",
    badgeColor: "#2563EB",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "75" },
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "40" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "14" },
    ],
    description: t('cambridgeTemplates.templates.fce.description'),
  },
  {
    id: 7,
    category: "international",
    templateKey: "ielts",
    name: t('cambridgeTemplates.templates.ielts.name'),
    fullName: t('cambridgeTemplates.templates.ielts.fullName'),
    level: t('cambridgeTemplates.templates.ielts.level'),
    age: t('cambridgeTemplates.templates.ielts.age'),
    duration: "165",
    questions: "4",
    borderColor: "#EF4444",
    badgeColor: "#EF4444",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "30" },
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "120" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "15" },
    ],
    description: t('cambridgeTemplates.templates.ielts.description'),
  },
  {
    id: 8,
    category: "international",
    templateKey: "vstep",
    name: t('cambridgeTemplates.templates.vstep.name'),
    fullName: t('cambridgeTemplates.templates.vstep.fullName'),
    level: t('cambridgeTemplates.templates.vstep.level'),
    age: t('cambridgeTemplates.templates.vstep.age'),
    duration: "150",
    questions: "4",
    borderColor: "#10B981",
    badgeColor: "#10B981",
    sections: [
      { name: t('cambridgeTemplates.templates.starters.sections.listening'), duration: "40" },
      { name: t('cambridgeTemplates.templates.starters.sections.readingWriting'), duration: "120" },
      { name: t('cambridgeTemplates.templates.starters.sections.speaking'), duration: "12" },
    ],
    description: t('cambridgeTemplates.templates.vstep.description'),
  },
];

export function CambridgeTemplates() {
  const { t } = useTranslation();
  const templates = getTemplates(t);
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    durationType: "template",
    customDuration: "",
    privacy: "private",
    autoGenerate: true,
  });

  const categories = [
    { key: "all", label: t('cambridgeTemplates.categories.all') },
    { key: "youngLearners", label: t('cambridgeTemplates.categories.youngLearners') },
    { key: "mainSuite", label: t('cambridgeTemplates.categories.mainSuite') },
    { key: "international", label: t('cambridgeTemplates.categories.international') },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setShowCreateForm(true);
    setCreateFormData({
      ...createFormData,
      title: `${template.name} Practice Test - Class A`,
      description: `Practice test for ${template.fullName.toLowerCase()}`,
    });
  };

  const getCategoryBadge = (category: string) => {
    if (category === "youngLearners" || category === "mainSuite") {
      return "🎓 Cambridge";
    }
    return "🌍 " + t('cambridgeTemplates.categories.international');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header breadcrumb={[t('breadcrumb.dashboard'), t('breadcrumb.cambridgeTemplates')]} />
      
      <div className="flex-1 overflow-y-auto p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#111827] mb-2">{t('cambridgeTemplates.title')}</h1>
          <p className="text-base text-[#6B7280]">{t('cambridgeTemplates.subtitle')}</p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
                selectedCategory === category.key
                  ? "bg-[#2563EB] text-white"
                  : "bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F3F4F6]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              type="text"
              placeholder={t('cambridgeTemplates.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 bg-white border-[#D1D5DB] rounded-lg"
            />
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              style={{ border: `2px solid ${template.borderColor}` }}
            >
              {/* Badge */}
              <div className="mb-4">
                <Badge 
                  className="text-white text-xs px-3 py-1 rounded-md"
                  style={{ backgroundColor: template.badgeColor }}
                >
                  {getCategoryBadge(template.category)}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[#111827] mb-2">{template.name}</h3>
              <p className="text-base text-[#6B7280] mb-6">{template.fullName}</p>

              {/* Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <BookOpen className="w-4 h-4" />
                  {template.level}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Users className="w-4 h-4" />
                  {template.age}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Clock className="w-4 h-4" />
                  {template.duration} {t('cambridgeTemplates.minutes')}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <FileText className="w-4 h-4" />
                  {template.questions} {t('cambridgeTemplates.questions')}
                </div>
              </div>

              {/* Sections */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#111827] mb-2">{t('cambridgeTemplates.sections')}:</p>
                <ul className="space-y-1">
                  {template.sections.map((section, idx) => (
                    <li key={idx} className="text-sm text-[#6B7280]">
                      • {section.name} ({section.duration} {t('cambridgeTemplates.minutes')})
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#D1D5DB] hover:bg-[#F3F4F6]"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {t('cambridgeTemplates.viewDetails')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-[#111827]">
                        {template.fullName}
                      </DialogTitle>
                      <p className="text-sm text-[#6B7280]">
                        {template.level} • {template.age} • {template.duration} {t('cambridgeTemplates.minutes')}
                      </p>
                    </DialogHeader>
                    <div className="mt-4 space-y-6">
                      <div>
                        <h4 className="font-semibold text-[#111827] mb-2">{t('cambridgeTemplates.modal.description')}:</h4>
                        <p className="text-sm text-[#6B7280]">{template.description}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                          onClick={() => {
                            handleUseTemplate(template);
                          }}
                        >
                          {t('cambridgeTemplates.modal.createExam')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                  onClick={() => handleUseTemplate(template)}
                >
                  {t('cambridgeTemplates.useTemplate')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Exam Form Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#111827]">
              {t('cambridgeTemplates.createForm.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Template Badge */}
            <div>
              <p className="text-sm text-[#6B7280] mb-2">{t('cambridgeTemplates.createForm.template')}:</p>
              {selectedTemplate && (
                <Badge 
                  className="text-white px-3 py-1"
                  style={{ backgroundColor: selectedTemplate.badgeColor }}
                >
                  {selectedTemplate.name}
                </Badge>
              )}
            </div>

            {/* Exam Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-[#111827] mb-2 block">
                {t('cambridgeTemplates.createForm.examTitleRequired')}
              </Label>
              <Input
                id="title"
                value={createFormData.title}
                onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                className="border-[#D1D5DB]"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-[#111827] mb-2 block">
                {t('cambridgeTemplates.createForm.description')}:
              </Label>
              <Textarea
                id="description"
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                className="border-[#D1D5DB] min-h-[100px]"
              />
            </div>

            {/* Duration */}
            <div>
              <Label className="text-sm font-medium text-[#111827] mb-3 block">
                {t('cambridgeTemplates.createForm.durationType.label')}:
              </Label>
              <RadioGroup 
                value={createFormData.durationType}
                onValueChange={(value) => setCreateFormData({ ...createFormData, durationType: value })}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="template" id="template-duration" />
                  <Label htmlFor="template-duration" className="font-normal cursor-pointer">
                    {t('cambridgeTemplates.createForm.durationType.useTemplate')} ({selectedTemplate?.duration} {t('cambridgeTemplates.minutes')})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom-duration" />
                  <Label htmlFor="custom-duration" className="font-normal cursor-pointer">
                    {t('cambridgeTemplates.createForm.durationType.custom')}
                  </Label>
                  {createFormData.durationType === "custom" && (
                    <Input
                      type="number"
                      placeholder={t('cambridgeTemplates.minutes')}
                      className="w-24 ml-2 border-[#D1D5DB]"
                      value={createFormData.customDuration}
                      onChange={(e) => setCreateFormData({ ...createFormData, customDuration: e.target.value })}
                    />
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* Privacy */}
            <div>
              <Label className="text-sm font-medium text-[#111827] mb-3 block">
                {t('cambridgeTemplates.createForm.privacy.label')}:
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="private" 
                    checked={createFormData.privacy === "private"}
                    onCheckedChange={(checked) => setCreateFormData({ ...createFormData, privacy: checked ? "private" : "public" })}
                  />
                  <Label htmlFor="private" className="font-normal cursor-pointer">
                    {t('cambridgeTemplates.createForm.privacy.private')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="public" 
                    checked={createFormData.privacy === "public"}
                    onCheckedChange={(checked) => setCreateFormData({ ...createFormData, privacy: checked ? "public" : "private" })}
                  />
                  <Label htmlFor="public" className="font-normal cursor-pointer">
                    {t('cambridgeTemplates.createForm.privacy.public')}
                  </Label>
                </div>
              </div>
            </div>

            {/* Auto-generate */}
            <div>
              <Label className="text-sm font-medium text-[#111827] mb-3 block">
                {t('cambridgeTemplates.createForm.autoGenerate.label')}:
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="auto-generate" 
                    checked={createFormData.autoGenerate}
                    onCheckedChange={(checked) => setCreateFormData({ ...createFormData, autoGenerate: checked as boolean })}
                  />
                  <Label htmlFor="auto-generate" className="font-normal cursor-pointer">
                    {t('cambridgeTemplates.createForm.autoGenerate.generate')} ({selectedTemplate?.questions})
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="empty-structure" 
                    checked={!createFormData.autoGenerate}
                    onCheckedChange={(checked) => setCreateFormData({ ...createFormData, autoGenerate: !checked })}
                  />
                  <Label htmlFor="empty-structure" className="font-normal cursor-pointer">
                    {t('cambridgeTemplates.createForm.autoGenerate.empty')}
                  </Label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 border-[#D1D5DB]"
                onClick={() => setShowCreateForm(false)}
              >
                {t('cambridgeTemplates.modal.cancel')}
              </Button>
              <Button 
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                onClick={() => {
                  console.log("Creating exam:", createFormData);
                  setShowCreateForm(false);
                }}
              >
                {t('cambridgeTemplates.createForm.submit')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}