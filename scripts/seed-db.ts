import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envFile = fs.readFileSync(envPath, 'utf-8');
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim();
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000'
];

async function seed() {
  console.log('Fetching CMS data...');
  const { data, error } = await supabase
    .from('cms_data')
    .select('data')
    .eq('id', 'main')
    .single();

  if (error || !data) {
    console.error('Error fetching:', error);
    return;
  }

  const cms = data.data;

  console.log('Injecting thorough case study placeholders...');
  
  cms.caseStudies = cms.caseStudies.map((cs: any, index: number) => {
    // 1. Hero Image
    if (!cs.heroImage) cs.heroImage = MOCK_IMAGES[index % MOCK_IMAGES.length];
    
    // 2. Video
    if (!cs.video || !cs.video.url) {
      cs.video = {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        youtubeId: '',
        aspectRatio: '16/9',
        title: { en: 'Product Walkthrough', ar: 'جولة في المنتج' },
        desc: { en: 'A brief overview of the final product.', ar: 'نظرة عامة موجزة على المنتج النهائي.' },
        duration: '2:15'
      };
    }
    
    // 3. Problem
    if (!cs.problem.narrative.en) {
      cs.problem.narrative = {
        en: 'The existing solution was clunky and difficult to navigate, resulting in high drop-off rates and user frustration. We needed a complete overhaul to modernize the experience.',
        ar: 'كان الحل الحالي معقدًا ويصعب التنقل فيه، مما أدى إلى ارتفاع معدلات التخلي وإحباط المستخدمين. كنا بحاجة إلى إصلاح شامل لتحديث التجربة.'
      };
    }
    if (!cs.problem.painPoints || cs.problem.painPoints.length === 0) {
      cs.problem.painPoints = [
        { icon: 'component', title: { en: 'Inconsistent UI', ar: 'واجهة غير متسقة' }, desc: { en: '15 different button styles and 8 navigation patterns', ar: '15 نمط أزرار مختلف و8 أنماط تنقل' } },
        { icon: 'timer', title: { en: 'Workflow Friction', ar: 'احتكاك سير العمل' }, desc: { en: 'Users took 40% longer to complete cross-app tasks', ar: 'استغرق إكمال المهام وقتاً أطول بنسبة 40%' } }
      ];
    }

    // 4. Research
    if (!cs.research.methods || !cs.research.methods.en || cs.research.methods.en.length === 0) {
      cs.research.methods = { en: ['UI Audit', 'Stakeholder Workshops'], ar: ['تدقيق الواجهة', 'ورش عمل أصحاب المصلحة'] };
    }
    if (!cs.research.insights || cs.research.insights.length === 0) {
      cs.research.insights = [
        { id: '1', quote: { en: 'I feel like I have to learn a new software every time I switch modules.', ar: 'أشعر وكأنني أتعلم برنامجاً جديداً في كل مرة أبدل فيها الوحدات.' }, author: { en: 'Enterprise User', ar: 'مستخدم مؤسسة' }, theme: { en: 'Consistency', ar: 'الاتساق' } }
      ];
    }
    if (!cs.research.findings || !cs.research.findings.en || cs.research.findings.en.length === 0) {
      cs.research.findings = { en: ['Users prefer linear workflows', 'Contrast is too low'], ar: ['يفضل المستخدمون مسارات العمل الخطية', 'التباين منخفض جداً'] };
    }

    // 5. Process
    if (!cs.process.steps || cs.process.steps.length === 0) {
      cs.process.steps = [
        { phase: 'Audit', title: { en: 'Component Inventory', ar: 'جرد المكونات' }, duration: { en: '3 weeks', ar: '3 أسابيع' }, desc: { en: 'Cataloged over 800 divergent components to identify baseline patterns.', ar: 'جرد أكثر من 800 مكون مختلف لتحديد الأنماط الأساسية.' } },
        { phase: 'Design', title: { en: 'Token Architecture', ar: 'هيكلة الرموز' }, duration: { en: '4 weeks', ar: '4 أسابيع' }, desc: { en: 'Established a semantic design token system to unify colors, typography, and spacing.', ar: 'إنشاء نظام رموز تصميم دلالي لتوحيد الألوان والطباعة.' } }
      ];
    }
    if (!cs.process.tradeoffs || cs.process.tradeoffs.length === 0) {
      cs.process.tradeoffs = [
        { decision: { en: 'Gradual Rollout', ar: 'إطلاق تدريجي' }, rationale: { en: 'We rolled out updates modularly to avoid disrupting enterprise workflows abruptly.', ar: 'أطلقنا التحديثات تدريجياً لتجنب تعطيل سير عمل المؤسسة.' } }
      ];
    }

    // 6. Screenshots
    if (!cs.screenshots || cs.screenshots.length === 0) {
      cs.screenshots = [
        { image: MOCK_IMAGES[(index + 1) % MOCK_IMAGES.length], caption: { en: 'Dashboard Overview', ar: 'نظرة عامة على لوحة القيادة' }, tag: { en: 'Web', ar: 'ويب' } },
        { image: MOCK_IMAGES[(index + 2) % MOCK_IMAGES.length], caption: { en: 'Mobile Layout', ar: 'تخطيط الجوال' }, tag: { en: 'Mobile', ar: 'جوال' } }
      ];
    }
    
    // 7. Solution Screens
    if (!cs.solution.screens || cs.solution.screens.length === 0) {
      cs.solution.screens = [
        { title: { en: 'Unified Component Library', ar: 'مكتبة مكونات موحدة' }, desc: { en: 'A centralized library linked to React components, enforcing strict brand guidelines.', ar: 'مكتبة مركزية مرتبطة بمكونات React لفرض إرشادات العلامة التجارية.' }, image: MOCK_IMAGES[(index + 3) % MOCK_IMAGES.length], callouts: { en: ['Semantic tokens', 'Dark mode support'], ar: ['رموز دلالية', 'دعم الوضع الداكن'] }, align: 'left' }
      ];
    }

    // 8. Results
    if (!cs.results.metrics || cs.results.metrics.length === 0) {
      cs.results.metrics = [
        { value: '3x', label: { en: 'Faster Prototyping', ar: 'نماذج أولية أسرع' }, sub: { en: 'For the design team', ar: 'لفريق التصميم' } }
      ];
    }
    if (!cs.results.quote || !cs.results.quote.text.en) {
      cs.results.quote = { text: { en: 'The new system finally makes our suite feel like a single, premium product.', ar: 'النظام الجديد يجعل حزمتنا تبدو أخيراً كمنتج واحد متميز.' }, author: { en: 'VP of Product', ar: 'نائب رئيس المنتج' }, role: { en: 'Stakeholder', ar: 'صاحب المصلحة' } };
    }

    // 9. Reflection
    if (!cs.reflection.summary || !cs.reflection.summary.en) {
      cs.reflection.summary = { en: 'Establishing governance early was critical. A design system is only as good as the adoption process supporting it.', ar: 'كان تأسيس الحوكمة مبكراً أمراً بالغ الأهمية. نظام التصميم جيد بقدر عملية الاعتماد التي تدعمه.' };
    }
    if (!cs.reflection.lessons || !cs.reflection.lessons.en || cs.reflection.lessons.en.length === 0) {
      cs.reflection.lessons = { en: ['Documentation is UX', 'Developer advocacy matters'], ar: ['التوثيق هو تجربة مستخدم', 'دعم المطورين مهم'] };
    }
    if (!cs.reflection.next || !cs.reflection.next.en || cs.reflection.next.en.length === 0) {
      cs.reflection.next = { en: ['Automate token sync to code', 'Expand motion guidelines'], ar: ['أتمتة مزامنة الرموز إلى الكود', 'توسيع إرشادات الحركة'] };
    }
    
    // 10. Core metrics (at root level)
    if (!cs.metrics || cs.metrics.length === 0) {
      cs.metrics = [
        { value: '-40%', label: { en: 'Cognitive Load Reduction', ar: 'تقليل التحميل المعرفي' }, sub: { en: '', ar: '' } },
        { value: '+28%', label: { en: 'User Activation', ar: 'تفعيل المستخدمين' }, sub: { en: '', ar: '' } },
        { value: '4.6/5', label: { en: 'Satisfaction Score', ar: 'درجة الرضا' }, sub: { en: '', ar: '' } }
      ];
    }

    return cs;
  });

  console.log('Uploading thorough data back to Supabase...');
  const { error: upsertError } = await supabase
    .from('cms_data')
    .upsert({ id: 'main', data: cms, updated_at: new Date().toISOString() }, { onConflict: 'id' });

  if (upsertError) {
    console.error('Failed to update:', upsertError);
  } else {
    console.log('Successfully thoroughly seeded CMS data!');
  }
}

seed();
