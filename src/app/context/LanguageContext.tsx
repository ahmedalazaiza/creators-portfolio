import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: (key: string, fallback?: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.explore": "Explore",
    "nav.search": "Search",
    "nav.creators": "Creators",
    "nav.shareWork": "Share Work",
    "nav.studio": "Creator Studio",
    "nav.profile": "My Profile",
    "nav.settings": "Account Settings",
    "nav.signOut": "Sign Out",
    "nav.signIn": "Sign In / Register",
    "nav.activity": "Activity",
    "nav.collections": "Moodboards",

    // Hero
    "hero.badge": "Azaiza Gallery — Curated Creative Benchmark",
    "hero.title1": "Discover & Showcase",
    "hero.title2": "Visionary Craft",
    "hero.subtitle": "Explore benchmark case studies in UI/UX systems, 3D CGI direction, spatial architecture, and brand identity from verified creators worldwide.",
    "hero.exploreBtn": "Explore Top Creators",
    "hero.shareBtn": "Share Masterwork",
    "hero.curatedWorks": "Curated Works",
    "hero.creators": "Visionary Creators",
    "hero.appreciations": "Appreciations",

    // Feeds
    "feed.forYou": "For You (Curated Discovery)",
    "feed.following": "Following Feed",
    "feed.community": "Community Pulse",
    "feed.emptyFollowing": "Your Following Feed is Empty",
    "feed.emptyFollowingDesc": "You haven't followed any creators yet. Follow leading designers to see their latest published masterworks right here!",
    "feed.exploreCreators": "Explore & Follow Creators",
    "feed.recommendedForYou": "Recommended For You",

    // Project Detail
    "project.appreciate": "Appreciate",
    "project.appreciated": "Appreciated",
    "project.save": "Save",
    "project.saved": "Saved",
    "project.share": "Share",
    "project.hire": "Hire",
    "project.follow": "Follow",
    "project.following": "Following",
    "project.aboutCaseStudy": "About the Case Study",
    "project.toolsUsed": "Software & Tools Used",
    "project.creativeKeywords": "Creative Keywords",
    "project.metrics": "Case Study Metrics",
    "project.views": "Views",
    "project.discussion": "Feedback & Discussion",
    "project.postComment": "Post Comment",
    "project.relatedWorks": "More in this discipline",

    // Studio & Dashboard
    "studio.title": "Studio Command Center",
    "studio.subtitle": "Creator Studio Benchmark",
    "studio.createBtn": "Create New Project",
    "studio.totalWorks": "Total Works",
    "studio.totalAppreciations": "Appreciations",
    "studio.totalImpressions": "Total Impressions",
    "studio.clientInquiries": "Client Inquiries",
    "studio.tabWorks": "Case Studies",
    "studio.tabAnalytics": "Growth & Analytics",
    "studio.tabInquiries": "Client Inquiries",
    "studio.tabModeration": "Content Moderation",
    "studio.publish": "Publish",
    "studio.draft": "Draft",
    "studio.delete": "Delete",
    "studio.edit": "Edit",
    "studio.pinned": "Pinned",

    // Hire Modal
    "hire.title": "Hire & Commission",
    "hire.available": "Available for freelance projects",
    "hire.yourName": "Your Name",
    "hire.yourEmail": "Your Email",
    "hire.company": "Company / Organization",
    "hire.budget": "Estimated Budget",
    "hire.timeline": "Desired Timeline",
    "hire.brief": "Project Brief & Scope",
    "hire.submit": "Send Project Request",
    "hire.cancel": "Cancel",
    "hire.success": "Inquiry Sent Successfully!",

    // Report
    "report.title": "Report Content",
    "report.reason": "Reason for Report",
    "report.details": "Additional Details",
    "report.submit": "Submit Report",
  },
  ar: {
    // Navigation
    "nav.explore": "استكشف",
    "nav.search": "البحث المتقدم",
    "nav.creators": "دليل المبدعين",
    "nav.shareWork": "نشر عمل",
    "nav.studio": "استوديو المبدع",
    "nav.profile": "ملفي الشخصي",
    "nav.settings": "إعدادات الحساب",
    "nav.signOut": "تسجيل الخروج",
    "nav.signIn": "تسجيل الدخول / حساب جديد",
    "nav.activity": "النشاط والتفاعل",
    "nav.collections": "لوحات الإلهام",

    // Hero
    "hero.badge": "معرض العزايزة — المعيار الإبداعي المختار",
    "hero.title1": "استكشف وانشر",
    "hero.title2": "الإبداع الاستثنائي",
    "hero.subtitle": "استكشف دراسات حالة رائدة في تصميم الواجهات، عوالم الـ 3D، الهويات البصرية، والتصوير المعماري من نخبة المبدعين عالمياً.",
    "hero.exploreBtn": "استكشف كبار المصممين",
    "hero.shareBtn": "انشر عملك الآن",
    "hero.curatedWorks": "أعمال مختارة",
    "hero.creators": "مبدع موثوق",
    "hero.appreciations": "إعجاب وتقدير",

    // Feeds
    "feed.forYou": "موصى لك (استكشاف مختار)",
    "feed.following": "خلاصة المتابعة",
    "feed.community": "نبض المجتمع",
    "feed.emptyFollowing": "خلاصة المتابعة فارغة",
    "feed.emptyFollowingDesc": "لم تقم بمتابعة أي مبدع بعد. تابع كبار المصممين لمشاهدة أحدث أعمالهم المنشورة هنا فوراً!",
    "feed.exploreCreators": "استكشف وتابع المبدعين",
    "feed.recommendedForYou": "أعمال مرشحة لذوقك",

    // Project Detail
    "project.appreciate": "إعجاب",
    "project.appreciated": "تم الإعجاب",
    "project.save": "حفظ",
    "project.saved": "محفوظ",
    "project.share": "مشاركة",
    "project.hire": "توظيف",
    "project.follow": "متابعة",
    "project.following": "تتابعه",
    "project.aboutCaseStudy": "عن دراسة الحالة والتوجه الفني",
    "project.toolsUsed": "البرامج والأدوات المستخدمة",
    "project.creativeKeywords": "الكلمات الدلالية",
    "project.metrics": "إحصائيات دراسة الحالة",
    "project.views": "المشاهدات",
    "project.discussion": "الآراء والمناقشة",
    "project.postComment": "أضف تعليقك",
    "project.relatedWorks": "المزيد في هذا المجال الإبداعي",

    // Studio & Dashboard
    "studio.title": "مركز قيادة الاستوديو",
    "studio.subtitle": "منصة إدارة أعمال المبدع",
    "studio.createBtn": "إنشاء دراسة حالة",
    "studio.totalWorks": "إجمالي الأعمال",
    "studio.totalAppreciations": "الإعجابات",
    "studio.totalImpressions": "مرات الظهور",
    "studio.clientInquiries": "طلبات العملاء",
    "studio.tabWorks": "دراسات الحالة",
    "studio.tabAnalytics": "النمو والتحليلات",
    "studio.tabInquiries": "طلبات التوظيف",
    "studio.tabModeration": "الإشراف والمراجعة",
    "studio.publish": "نشر",
    "studio.draft": "مسودة",
    "studio.delete": "حذف",
    "studio.edit": "تعديل",
    "studio.pinned": "مثبت",

    // Hire Modal
    "hire.title": "توظيف وتكليف بمشروع",
    "hire.available": "متاح للمشاريع والعمل الحر",
    "hire.yourName": "الاسم الكامل",
    "hire.yourEmail": "البريد الإلكتروني",
    "hire.company": "الشركة / المؤسسة",
    "hire.budget": "الميزانية التقديرية",
    "hire.timeline": "الجدول الزمني المفضل",
    "hire.brief": "ملخص وأهداف المشروع",
    "hire.submit": "إرسال طلب المشروع",
    "hire.cancel": "إلغاء",
    "hire.success": "تم إرسال الطلب بنجاح!",

    // Report
    "report.title": "الإبلاغ عن محتوى",
    "report.reason": "سبب البلاغ",
    "report.details": "تفاصيل إضافية",
    "report.submit": "إرسال البلاغ",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  isRTL: false,
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("app_lang") as Language;
    return saved === "ar" || saved === "en" ? saved : "en";
  });

  const isRTL = language === "ar";

  useEffect(() => {
    localStorage.setItem("app_lang", language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    if (isRTL) {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => setLanguageState(lang);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
