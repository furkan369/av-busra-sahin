/**
 * AVUKAT BÜŞRA ŞAHİN - WEB UYGULAMASI JAVASCRIPT MOTORU
 * Mobil menü, Akordeon, Form doğrulama, Modal sistemi ve mikro etkileşimler
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initContactForm();
  initModals();
  initSmoothScroll();
});

/* -------------------------------------------------------------------------
   1. Navbar & Kaydırma Etkileşimleri
   ------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-item a');

  // Sayfa kaydırıldığında header arka planını koyulaştır
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightCurrentSection();
  }, { passive: true });

  // Mobil Menü Aç/Kapat
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen 
        ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Menü linkine tıklandığında menüyü kapat
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
      });
    });
  }

  // Aktif bölümü menüde işaretle
  function highlightCurrentSection() {
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const activeLink = document.querySelector(`.nav-item a[href="#${id}"]`);

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }
}

/* -------------------------------------------------------------------------
   2. Sık Sorulan Sorular (Akordeon)
   ------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Diğerlerini kapat (akıcı tekli mod)
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Tıklananı aç/kapat
      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* -------------------------------------------------------------------------
   3. İletişim Formu & Toast Bildirim
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('lawContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="fullname"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const subject = form.querySelector('[name="subject"]')?.value;
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Lütfen gerekli (*) tüm alanları doldurunuz.', 'warning');
      return;
    }

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Lütfen geçerli bir e-posta adresi giriniz.', 'warning');
      return;
    }

    // Gönderim Animasyonu & Simülasyonu
    const submitBtn = form.querySelector('.form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mesajınız İletiliyor...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Mesajınız başarıyla iletildi. En kısa sürede geri dönüş yapılacaktır.', 'success');
    }, 1000);
  });
}

// Bildirim Mesajı Gösterici (Toast)
function showToast(message, type = 'success') {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  const iconSvg = type === 'success'
    ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
    : `<svg class="toast-icon" style="color: #f59e0b;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* -------------------------------------------------------------------------
   4. Modal Pencereleri (Hizmet Detayları, KVKK & Aydınlatma Metinleri)
   ------------------------------------------------------------------------- */
const serviceDetailsData = {
  aile: {
    title: 'Aile Hukuku Hizmetlerimiz',
    content: `
      <p>Aile Hukuku alanında müvekkillerimizin hassasiyetlerini en üst düzeyde gözeterek çözüm odaklı ve gizlilik esasına dayalı danışmanlık sunmaktayız.</p>
      <ul>
        <li><strong>Anlaşmalı ve Çekişmeli Boşanma Davaları:</strong> Sürecin psikolojik ve hukuki boyutlarının profesyonelce yönetimi.</li>
        <li><strong>Velayet ve Kişisel İlişki Kurulması:</strong> Çocuğun üstün yararı ilkesi doğrultusunda hakların tesisi.</li>
        <li><strong>Nafaka ve Tazminat Talepleri:</strong> Tedbir, iştirak, yoksulluk nafakası ile maddi ve manevi tazminat süreçleri.</li>
        <li><strong>Mal Rejiminin Tasfiyesi:</strong> Edinilmiş mallara katılma rejiminden doğan artık değer ve katkı payı alacakları.</li>
      </ul>
      <p>Sorularınız ve randevu talebiniz için lütfen ofisimizle iletişime geçiniz.</p>
    `
  },
  ceza: {
    title: 'Ceza Hukuku Hizmetlerimiz',
    content: `
      <p>Ceza yargılamasında hak kayıplarının telafisi mümkün olmayacak sonuçlar doğurmaması adına soruşturma aşamasından infaz aşamasına kadar etkin ve titiz savunma gerçekleştiriyoruz.</p>
      <ul>
        <li><strong>Soruşturma & İfade Alma:</strong> Emniyet, jandarma ve savcılık ifadelerinde müdafilik ve vekillik.</li>
        <li><strong>Sulh Ceza Hakimliği Süreçleri:</strong> Tutuklama, adli kontrol kararlarına itiraz ve sorgu takibi.</li>
        <li><strong>Ağır Ceza & Asliye Ceza Davaları:</strong> Kovuşturma aşamasında duruşma takibi, savunma stratejisi ve delil araştırması.</li>
        <li><strong>İstinaf ve Yargıtay Başvuruları:</strong> Kararlara karşı kanun yolu müracaatları ve temyiz dilekçeleri.</li>
      </ul>
    `
  },
  is: {
    title: 'İş ve Sosyal Güvenlik Hukuku',
    content: `
      <p>İşçi ve işveren arasındaki uyuşmazlıklarda arabuluculuktan mahkeme kararlarının icrasına kadar tüm safhalarda hukuki destek sağlamaktayız.</p>
      <ul>
        <li><strong>Kıdem ve İhbar Tazminatı:</strong> Haksız fesih durumunda doğan tüm işçilik haklarının tahsili.</li>
        <li><strong>İşe İade Davaları:</strong> Geçerli veya haklı nedene dayanmayan fesihlere karşı açılan davalar.</li>
        <li><strong>İş Kazaları ve Meslek Hastalıkları:</strong> Maddi ve manevi tazminat talepleri, maluliyet tespiti davaları.</li>
        <li><strong>SGK Uyuşmazlıkları ve Hizmet Tespiti:</strong> Sigortasız çalıştırılma ve eksik prim günlerinin tespiti davaları.</li>
      </ul>
    `
  },
  ticaret: {
    title: 'Ticaret ve Şirketler Hukuku',
    content: `
      <p>Şirketlerin ticari faaliyetlerini mevzuata tam uyumlu, risksiz ve sürdürülebilir şekilde yürütmelerini temin ediyoruz.</p>
      <ul>
        <li><strong>Ticari Sözleşmeler:</strong> Bayilik, distribütörlük, gizlilik, franchise ve satın alma sözleşmelerinin tanzimi.</li>
        <li><strong>Şirket Kuruluş ve Genel Kurul İşlemleri:</strong> Ana sözleşme hazırlama, sermaye artırımı/azaltımı.</li>
        <li><strong>Ortaklar Arası Uyuşmazlıklar:</strong> Ortaklıktan çıkma, pay devirleri ve yönetici sorumluluk davaları.</li>
        <li><strong>Haksız Rekabet ve Marka Uyuşmazlıkları:</strong> Ticari itibarın ve fikri hakların korunması.</li>
      </ul>
    `
  },
  gayrimenkul: {
    title: 'Gayrimenkul Hukuku',
    content: `
      <p>Taşınmaz mülkiyetine ilişkin uyuşmazlıklarda güncel içtihatlar ve mevzuat ışığında kapsamlı çözümler sunuyoruz.</p>
      <ul>
        <li><strong>Tapu İptali ve Tescil Davaları:</strong> Yolsuz tescil, inançlı işlem ve hileye dayalı mülkiyet davaları.</li>
        <li><strong>Kira Hukuku & Tahliye Davaları:</strong> Tahliye taahhütnamesi, kira tespit ve kira alacak davaları.</li>
        <li><strong>Ortaklığın Giderilmesi (İzale-i Şüyu):</strong> Hisseli taşınmazlarda satış veya aynen taksim süreçleri.</li>
        <li><strong>Kamulaştırmasız El Atma & İmar Uyuşmazlıkları:</strong> Bedel tespiti ve tescil davaları.</li>
      </ul>
    `
  },
  icra: {
    title: 'İcra ve İflas Hukuku',
    content: `
      <p>Alacakların en hızlı ve etkin şekilde tahsili, haciz işlemleri ve borç tasfiye süreçlerinde deneyimli temsil desteği.</p>
      <ul>
        <li><strong>İlamsız ve İlamlı İcra Takipleri:</strong> Çek, senet, fatura ve mahkeme ilamlarına dayalı alacakların takibi.</li>
        <li><strong>İhtiyati Haciz Kararları:</strong> Borçlunun mal kaçırmasını önleyici ivedi tedbir kararları alınması.</li>
        <li><strong>İtirazın İptali ve Menfi Tespit Davaları:</strong> Haksız takiplere itiraz veya itirazın kaldırılması davaları.</li>
        <li><strong>Konkordato ve Borç Yapılandırması:</strong> Şirketlerin mali dengesini korumaya yönelik yeniden yapılandırma.</li>
      </ul>
    `
  },
  miras: {
    title: 'Miras Hukuku',
    content: `
      <p>Mirasbırakanın vefatı sonrasında mirasçıların haklarının adil paylaşımı ve korunması için hukuki danışmanlık.</p>
      <ul>
        <li><strong>Veraset İlamı & Miras Taksim Sözleşmeleri:</strong> Yasal mirasçıların ve payların resmi tespiti ve paylaşımı.</li>
        <li><strong>Tenkis ve Denkleştirme Davaları:</strong> Saklı payı ihlal edilen mirasçıların hak talepleri.</li>
        <li><strong>Muris Muvazaası (Mirastan Mal Kaçırma):</strong> Tapu devirlerinin iptali davaları.</li>
        <li><strong>Vasiyetname Tanzimi & Vasiyetnamenin İptali:</strong> Hukuka uygun vasiyet hazırlığı veya iptali süreçleri.</li>
      </ul>
    `
  },
  idare: {
    title: 'İdare ve Vergi Hukuku',
    content: `
      <p>Kamu idarelerinin gerçekleştirdiği hukuka aykırı idari işlem ve eylemlere karşı vatandaşların hak arama süreçlerini yürütüyoruz.</p>
      <ul>
        <li><strong>İptal Davaları:</strong> Hukuka aykırı idari işlemlerin geçmişe etkili olarak yürürlükten kaldırılması.</li>
        <li><strong>Tam Yargı (Tazminat) Davaları:</strong> İdarenin hizmet kusurundan doğan zararların tazmini.</li>
        <li><strong>Kamu Görevlileri & Disiplin Cezaları:</strong> Memur atama, tayin ve disiplin cezalarının iptali davaları.</li>
        <li><strong>İdari Para Cezalarına İtirazlar:</strong> Ruhsat iptalleri ve kurum cezalarına karşı başvurular.</li>
      </ul>
    `
  }
};

const legalTextsData = {
  gizlilik: {
    title: 'Gizlilik Politikası',
    content: `
      <p>Avukat Büşra Şahin Hukuk Bürosu olarak, web sitemizi ziyaret eden kullanıcıların gizliliğine ve kişisel verilerinin korunmasına azami önem veriyoruz.</p>
      <p>Sitemiz üzerinden paylaştığınız iletişim bilgileri yalnızca tarafınızla iletişime geçmek ve hukuki danışmanlık taleplerinizi değerlendirmek amacıyla kullanılır. Bilgileriniz hiçbir koşulda üçüncü taraflarla ticari amaçla paylaşılmaz.</p>
    `
  },
  kullanim: {
    title: 'Kullanım Şartları',
    content: `
      <p>Bu sitede yer alan tüm makale, yazı ve görsel materyaller yalnızca bilgilendirme amaçlı olup, Türkiye Barolar Birliği Avukatlık Reklam Yasağı Yönetmeliği'ne uygun olarak hazırlanmıştır.</p>
      <p>Sitedeki içerikler herhangi bir davanın doğrudan çözümü veya hukuki mütalaa niteliği taşımamakta olup, somut hukuki olaylarınız için bir avukata başvurulması tavsiye edilir.</p>
    `
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    content: `
      <p>6698 Sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, veri sorumlusu sıfatıyla Avukat Büşra Şahin tarafından işlenen ad, soyad, telefon ve e-posta bilgileriniz;</p>
      <ul>
        <li>Hukuki danışmanlık talebinizin karşılanması,</li>
        <li>Randevu oluşturulması ve müvekkil ilişkilerinin yönetimi,</li>
        <li>Yasal yükümlülüklerin yerine getirilmesi amaçlarıyla sınırlı olarak işlenmektedir.</li>
      </ul>
      <p>KVKK'nın 11. maddesi kapsamındaki haklarınızı <strong>av.busraasahin@gmail.com</strong> adresine yazılı başvuruda bulunarak her zaman kullanabilirsiniz.</p>
    `
  },
  hakkimda: {
    title: 'Avukat Büşra Şahin Hakkında',
    content: `
      <p><strong>Avukat Büşra Şahin</strong>, Konya Barosu'na kayıtlı olarak Konya merkezli hukuk ofisinde faaliyet göstermektedir.</p>
      <p>Hukuki ihtilaflarda önleyici hukuk danışmanlığı, titiz delil analizi, şeffaf bilgilendirme ve çözüm odaklı temsil anlayışını temel ilke edinmiştir. Ceza Hukuku, Aile Hukuku, Ticaret Hukuku, Gayrimenkul Hukuku ve İş Hukuku başta olmak üzere geniş bir yelpazede yerli ve yabancı müvekkillerine profesyonel avukatlık hizmeti sunmaktadır.</p>
      <p>Adresimiz: Akabe Mah. Saçlıkasap Cad. No:157A/112 Karatay Plaza A1 Giriş, Karatay / KONYA (Konya Adliyesi Karşısı).</p>
    `
  }
};

function initModals() {
  const modalOverlay = document.getElementById('generalModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalCloseBtn');

  if (!modalOverlay || !modalTitle || !modalBody) return;

  function openModal(title, htmlContent) {
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Hizmet Detayları Butonları
  document.querySelectorAll('[data-service-key]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-service-key');
      const data = serviceDetailsData[key];
      if (data) {
        openModal(data.title, data.content);
      }
    });
  });

  // Yasal Bilgilendirme & Hakkımda Linkleri
  document.querySelectorAll('[data-legal-key]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-legal-key');
      const data = legalTextsData[key];
      if (data) {
        openModal(data.title, data.content);
      }
    });
  });

  // Hero Kartı tıklamaları
  document.querySelectorAll('.practice-item').forEach(item => {
    item.addEventListener('click', () => {
      const targetService = item.getAttribute('data-target-service');
      if (targetService && serviceDetailsData[targetService]) {
        openModal(serviceDetailsData[targetService].title, serviceDetailsData[targetService].content);
      }
    });
  });
}

/* -------------------------------------------------------------------------
   5. Akıcı Kaydırma Desteği
   ------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}
