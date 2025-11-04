import { ar } from 'vuetify/locale'

export default {
    title: 'نظام إدارة التعليمة',
     dash: 'الصفحة الرئيسية',
      contact: 'اتصل بنا',
    about: 'حول النظام',
    logout: 'تسجيل الخروج',
       login: 'تسجيل الدخول',
         students: 'الطلاب',
    teachers: 'المعلمين',
    classes: 'الصفوف',
    courses: 'الدورات',
    buses: 'الحافلات',
    attendance: 'الحضور',
     recentCourses: 'الدورات الحديثة',
       recentStudents: 'الطلاب الجدد',
      courses: {
      101: 'رياضيات 101',
      102: 'فيزياء 201',
      103: 'تقنية 301',
      104: 'رياضة 401',
      105: 'كهرباء 201',
    },
  
    
    $vuetify: {
        ...ar,
    }
}