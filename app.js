// ناوبری ساده بین صفحات
function goTo(path) {
    window.location.href = path;
  }
  
  // فعال‌سازی دکمه ادامه در intro بر اساس پذیرش
  function initIntro() {
    const checkbox = document.querySelector('#accept');
    const continueBtn = document.querySelector('#continueBtn');
    if (checkbox && continueBtn) {
      checkbox.addEventListener('change', () => {
        continueBtn.disabled = !checkbox.checked;
      });
    }
  }
  
  // مدیریت پرسشنامه
  const questionnaireState = {
    currentIndex: 0,
    answers: []
  };
  
  // 12 سوال چندگزینه‌ای
  const QUESTIONS = [
    {
      q: 'پوست صورت شما در ناحیه تی (پیشانی، بینی، چانه) در طول روز چگونه است؟',
      options: ['عموماً خشک', 'متعادل', 'کمی چرب', 'خیلی چرب']
    },
    {
      q: 'پس از شست‌وشو بدون کرم، کشیدگی پوستتان را چگونه توصیف می‌کنید؟',
      options: ['خیلی زیاد', 'کمی', 'طبیعی', 'هیچ کشیدگی']
    },
    {
      q: 'به کدام مورد بیشتر حساس هستید؟',
      options: ['آفتاب', 'عطر/الکل', 'هیچکدام', 'تغییرات دما']
    },
    {
      q: 'در طول روز چند بار برق‌زدگی (Shine) روی گونه‌ها یا بینی دارید؟',
      options: ['هیچ‌وقت', 'گاهی', 'اغلب', 'همیشه']
    },
    {
      q: 'قرمزی یا التهاب پس از استفاده محصولات جدید چقدر رخ می‌دهد؟',
      options: ['زیاد', 'متوسط', 'کم', 'ندرتاً']
    },
    {
      q: 'احساس خشکی دور دهان یا اطراف گونه‌ها چقدر تجربه می‌کنید؟',
      options: ['همیشه', 'گاهی', 'به ندرت', 'هرگز']
    },
    {
      q: 'اندازه منافذ در بینی و اطراف آن را چگونه می‌بینید؟',
      options: ['خیلی ریز', 'متوسط', 'درشت', 'خیلی درشت']
    },
    {
      q: 'پس از ۴ ساعت بدون آرایش/کرم، وضعیت برق‌زدگی پوست؟',
      options: ['بدون برق', 'کم', 'متوسط', 'زیاد']
    },
    {
      q: 'پوست شما نسبت به لایه‌بردارها چگونه واکنش نشان می‌دهد؟',
      options: ['تحریک شدید', 'تحریک خفیف', 'بی‌تفاوت', 'بهبود محسوس']
    },
    {
      q: 'الگوی خشکی/چربی در نواحی مختلف صورت چگونه است؟',
      options: ['خشک یکنواخت', 'مختلط رو به خشک', 'مختلط', 'مختلط رو به چرب']
    },
    {
      q: 'در طول هفته چند بار جوش یا کومدون می‌زنید؟',
      options: ['هیچ', '۱-۲ بار', '۳-۴ بار', '۵+ بار']
    },
    {
      q: 'در نور طبیعی، بافت پوستتان را چطور ارزیابی می‌کنید؟',
      options: ['یکدست', 'کمی ناصاف', 'ناصاف', 'خیلی ناصاف']
    }
  ];
  
  function initQuestionnaire() {
    const qText = document.querySelector('#qText');
    const optionsWrap = document.querySelector('#optionsWrap');
    const nextBtn = document.querySelector('#nextQuestionBtn');
    const progressBar = document.querySelector('.progress-bar');
    const indexText = document.querySelector('#indexText');
  
    function renderQuestion() {
      const i = questionnaireState.currentIndex;
      const item = QUESTIONS[i];
      if (!item) return;
      qText.textContent = item.q;
      optionsWrap.innerHTML = '';
      item.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.type = 'button';
        btn.innerHTML = `
          <span class="option-label">${opt}</span>
          <span class="check-icon">✓</span>
        `;
        if (questionnaireState.answers[i] === idx) {
          btn.classList.add('option-selected');
          nextBtn.disabled = false;
        }
        btn.addEventListener('click', () => {
          Array.from(optionsWrap.children).forEach(c => {
            c.classList.remove('option-selected');
          });
          btn.classList.add('option-selected');
          questionnaireState.answers[i] = idx;
          nextBtn.disabled = false;
        });
        optionsWrap.appendChild(btn);
      });
      nextBtn.disabled = questionnaireState.answers[i] == null;
      const pct = Math.round(((i) / QUESTIONS.length) * 100);
      if (progressBar) progressBar.style.width = pct + '%';
      if (indexText) indexText.textContent = `سوال ${i + 1} از ${QUESTIONS.length}`;
    }
  
    renderQuestion();
  
    nextBtn.addEventListener('click', () => {
      const i = questionnaireState.currentIndex;
      if (questionnaireState.answers[i] == null) return;
      if (i < QUESTIONS.length - 1) {
        questionnaireState.currentIndex++;
        renderQuestion();
      } else {
        // پایان سوالات -> صفحه آپلود
        goTo('upload.html');
      }
    });
  }
  
  // صفحه آپلود: مدیریت انتخاب حداکثر 3 عکس و پیش‌نمایش
  function initUpload() {
    const input = document.querySelector('#photoInput');
    const grid = document.querySelector('#previewGrid');
    if (!input || !grid) return;
  
    input.addEventListener('change', () => {
      const files = Array.from(input.files || []).slice(0, 3);
      grid.innerHTML = '';
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = e => {
          const div = document.createElement('div');
          div.className = 'preview-item';
          div.innerHTML = `<img src="${e.target.result}" alt="پیش‌نمایش">`;
          grid.appendChild(div);
        };
        reader.readAsDataURL(file);
      });
    });
  }
  
  // صفحه نتیجه: نمایش نتیجه آزمایشی
  function initResult() {
    const resultBox = document.querySelector('#resultBox');
    if (!resultBox) return;
    // تحلیل آزمایشی ساده بر اساس پاسخ‌ها (در حالت واقعی از سرور می‌آید)
    const scoreOil = (questionnaireState.answers[0] ?? 1) + (questionnaireState.answers[3] ?? 1) + (questionnaireState.answers[7] ?? 1);
    const scoreDry = (questionnaireState.answers[1] ?? 1) + (questionnaireState.answers[5] ?? 1);
    const scoreSensitive = (questionnaireState.answers[2] ?? 1) + (questionnaireState.answers[4] ?? 1) + (questionnaireState.answers[8] ?? 1);
  
    let skinType = 'مختلط';
    if (scoreOil >= 7) skinType = 'چرب';
    else if (scoreDry >= 5) skinType = 'خشک';
    else if (scoreSensitive >= 6) skinType = 'حساس';
  
    resultBox.innerHTML = resultBox.innerHTML +`
      <div class="card">
        <h2 class="text-lg font-semibold mb-2">نتیجه آزمایشی تحلیل پوست</h2>
        <p class="mb-2">تیپ تقریبی پوست شما: <strong>${skinType}</strong></p>
        <ul class="list-disc pr-5 text-sm text-muted">
          <li>خشکی، چربی و حساسیت براساس پاسخ‌ها امتیازدهی شده‌اند.</li>
          <li>این نتیجه آزمایشی است و برای نمایش روند محصول ارائه می‌شود.</li>
        </ul>
      </div>
    `;
  }
  
  // صفحه روتین: تولید روتین صبح و شب آزمایشی
  function initRoutine() {
    const morningList = document.querySelector('#morningList');
    const nightList = document.querySelector('#nightList');
    if (!morningList || !nightList) return;
  
    const routineMorning = [
      'پاک‌سازی ملایم',
      'تونر بدون الکل',
      'سرم آبرسان (هیالورونیک اسید)',
      'مرطوب‌کننده سبک',
      'ضدآفتاب SPF 50'
    ];
  
    const routineNight = [
      'پاک‌سازی عمقی',
      'سرم هدفمند (نیاسینامید یا رتینال، بسته به حساسیت)',
      'مرطوب‌کننده مغذی',
      'در صورت نیاز: محصول ضدلک روی نقاط هدف'
    ];
  
    morningList.innerHTML = routineMorning.map(i => `<li class="mb-1">${i}</li>`).join('');
    nightList.innerHTML = routineNight.map(i => `<li class="mb-1">${i}</li>`).join('');
  }
  
  // راه‌انداز عمومی براساس شناسه‌های عناصر
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#accept')) initIntro();
    if (document.querySelector('#qText')) initQuestionnaire();
    if (document.querySelector('#photoInput')) initUpload();
    if (document.querySelector('#resultBox')) initResult();
    if (document.querySelector('#morningList')) initRoutine();
  });
  