document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
    }
  });

  const revealTargets = document.querySelectorAll(
    ".feature-box, .info-card, .step-card, .testimonial-card, .service-card, .service-image, .card"
  );

  revealTargets.forEach(function (target) {
    target.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(function (target) {
      observer.observe(target);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add("visible");
    });
  }

  const navbarCollapse = document.getElementById("mainNavbar");
  if (navbarCollapse) {
    navbarCollapse.addEventListener("click", function (event) {
      if (event.target.closest(".nav-link") && window.innerWidth < 992) {
        const collapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (collapse) collapse.hide();
      }
    });
  }

  const backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(backToTop);

  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const form = document.getElementById("leadForm");
  const submitBtn = document.getElementById("submitBtn");

  if (form && submitBtn) {
    const formMessage = document.getElementById("formMessage");

    function validateForm() {
      submitBtn.disabled = !form.checkValidity();
    }

    form.addEventListener("input", validateForm);
    form.addEventListener("change", validateForm);
    validateForm();

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Submitting...';

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          form.reset();
          validateForm();
          submitBtn.textContent = "Submit Inquiry";
          if (formMessage) {
            formMessage.innerHTML =
              '<div class="alert alert-success mt-3" role="alert">Thank you. Your inquiry has been submitted successfully.</div>';
          }
        } else {
          throw new Error("Submission failed");
        }
      } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Inquiry";
        if (formMessage) {
          formMessage.innerHTML =
            '<div class="alert alert-danger mt-3" role="alert">We could not submit your inquiry. Please check your connection and try again.</div>';
        }
      }
    });
  }

  const ratingForm = document.getElementById("serviceRatingForm");
  const ratingSubmitBtn = document.getElementById("ratingSubmitBtn");

  if (ratingForm && ratingSubmitBtn) {
    const ratingInputs = ratingForm.querySelectorAll('input[name="rating"]');
    const ratingOptions = ratingForm.querySelectorAll(".rating-option");
    const ratingMessage = document.getElementById("ratingFormMessage");

    function updateRatingState() {
      const selectedInput = ratingForm.querySelector('input[name="rating"]:checked');
      const selectedRating = selectedInput ? Number(selectedInput.value.charAt(0)) : 0;

      ratingOptions.forEach(function (option) {
        option.classList.toggle("is-selected", Number(option.dataset.rating) <= selectedRating);
      });

      ratingSubmitBtn.disabled = !ratingForm.checkValidity();
    }

    ratingInputs.forEach(function (input) {
      input.addEventListener("change", updateRatingState);
    });

    ratingForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (!ratingForm.reportValidity()) return;

      ratingSubmitBtn.disabled = true;
      ratingSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Sending...';

      try {
        const response = await fetch(ratingForm.action, {
          method: "POST",
          body: new FormData(ratingForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Rating submission failed");

        ratingForm.reset();
        updateRatingState();
        ratingSubmitBtn.textContent = "Send feedback";
        if (ratingMessage) {
          ratingMessage.innerHTML = '<div class="alert alert-success" role="status">Thank you for sharing your feedback.</div>';
        }
      } catch (error) {
        ratingSubmitBtn.disabled = false;
        ratingSubmitBtn.textContent = "Send feedback";
        if (ratingMessage) {
          ratingMessage.innerHTML = '<div class="alert alert-danger" role="alert">We could not send your feedback. Please try again.</div>';
        }
      }
    });
  }

  const chatMarkup = `
    <button class="debt-chat-launcher btn btn-primary" type="button" aria-controls="debtChat" aria-expanded="false">
      <i class="bi bi-chat-dots-fill" aria-hidden="true"></i>
      <span>Ask us</span>
    </button>
    <aside class="debt-chat" id="debtChat" aria-label="Debt assistance assistant" aria-hidden="true">
      <header class="debt-chat-header">
        <div>
          <h2>Debt Settlement Partners</h2>
          <p>Debt assistance assistant</p>
        </div>
        <button class="debt-chat-close" type="button" aria-label="Close chat">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </header>
      <div class="debt-chat-body">
        <div class="debt-chat-messages" role="log" aria-live="polite">
          <p class="chat-message bot">Hi! Ek kan help in English or Afrikaans. Ndiyakwazi ukunceda ngesiXhosa. I can answer general questions about South African debt review, debt mediation, debt review removal and debt settlement. Please do not share ID numbers, account details, banking information, passwords, PINs, OTPs or unredacted documents here. What would you like to know?</p>
        </div>
        <div class="debt-chat-suggestions" aria-label="Suggested questions">
          <button type="button" class="chat-suggestion" data-question="What is debt review?">What is debt review?</button>
          <button type="button" class="chat-suggestion" data-question="What documents may I need?">What documents may I need?</button>
          <button type="button" class="chat-suggestion" data-question="How is affordability estimated?">How is affordability estimated?</button>
          <button type="button" class="chat-suggestion" data-question="How do I contact the team?">How do I contact the team?</button>
        </div>
        <div class="debt-chat-input-wrap">
          <form class="debt-chat-form">
            <label class="visually-hidden" for="debtChatInput">Type your question</label>
            <input class="debt-chat-input" id="debtChatInput" type="text" maxlength="300" autocomplete="off" placeholder="Type your question...">
            <button class="debt-chat-send" type="submit" aria-label="Send message">
              <i class="bi bi-arrow-up" aria-hidden="true"></i>
            </button>
          </form>
          <p class="debt-chat-disclaimer">General information only. Don&apos;t share ID, banking, password, OTP or account details here.</p>
        </div>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML("beforeend", chatMarkup);

  const chat = document.getElementById("debtChat");
  const launcher = document.querySelector(".debt-chat-launcher");
  const closeButton = document.querySelector(".debt-chat-close");
  const chatForm = document.querySelector(".debt-chat-form");
  const chatInput = document.querySelector(".debt-chat-input");
  const messages = document.querySelector(".debt-chat-messages");
  const suggestions = document.querySelector(".debt-chat-suggestions");

  function setChatOpen(isOpen) {
    chat.classList.toggle("open", isOpen);
    chat.setAttribute("aria-hidden", String(!isOpen));
    launcher.classList.toggle("hidden", isOpen);
    launcher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) window.setTimeout(function () { chatInput.focus(); }, 220);
  }

  function addMessage(text, sender) {
    const message = document.createElement("p");
    message.className = "chat-message " + sender;
    message.textContent = text;
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function getChatResponse(question) {
    const normalized = " " + question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim() + " ";

    const afrikaansMarkers = ["skuldhersiening", "skuldberading", "dokumente", "inkomste", "uitgawes", "hallo", "hoe werk", "wat is", "aansoek", "fooie", "dagvaarding", "kredietburo", "kontak"];
    const xhosaMarkers = ["yintoni", "ndifuna", "ndicela", "nceda", "amatyala", "ingeniso", "iindleko", "amaxwebhu", "molo", "isamani", "qhagamshelana"];
    const afScore = afrikaansMarkers.filter(function (marker) { return normalized.includes(" " + marker + " "); }).length;
    const xhScore = xhosaMarkers.filter(function (marker) { return normalized.includes(" " + marker + " "); }).length;
    const language = xhScore > afScore && xhScore > 0 ? "xh" : afScore > 0 ? "af" : "en";

    function findAmount(labels) {
      const match = normalized.match(new RegExp("(?:" + labels + ")\\s*(?:is|of|yi|ngu|:|=)?\\s*(?:r\\s*)?([0-9][0-9, ]*(?:\\.[0-9]{1,2})?)", "i"));
      if (!match) return null;
      const amount = Number(match[1].replace(/[\s,]/g, ""));
      return Number.isFinite(amount) && amount >= 0 ? amount : null;
    }

    const income = findAmount("net (?:monthly )?(?:household )?income|monthly net (?:household )?income|take home pay|maandelikse netto inkomste|ingeniso");
    const expenses = findAmount("monthly (?:living|household) expenses|monthly expenses|living expenses|maandelikse uitgawes|lewenskoste|iindleko");
    const instalments = findAmount("current monthly debt instalments|monthly debt instalments|debt instalments|monthly debt payments|maandelikse skuldpaaiemente|izavenge");

    function rand(amount) {
      return "R " + new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 2 }).format(amount);
    }

    if (income !== null && expenses !== null && instalments !== null) {
      const beforeDebt = income - expenses;
      const remaining = beforeDebt - instalments;
      if (language === "af") {
        const result = remaining < 0 ? "’n maandelikse tekort van " + rand(Math.abs(remaining)) : rand(remaining) + " wat moontlik oorbly";
        return "Volgens die bedrae wat jy gegee het, is " + rand(beforeDebt) + " voor skuldterugbetalings. Na huidige skuldpaaiemente dui dit op " + result + ". Dit is ’n voorlopige skatting, nie ’n amptelike bekostigbaarheidsbeoordeling, goedgekeurde aanbod of waarborg van kwalifikasie nie. Bevestig die bedrae deur ’n veilige assessering met ’n professionele raadgewer.";
      }
      if (language === "xh") {
        const result = remaining < 0 ? "intsilelo yenyanga eyi-" + rand(Math.abs(remaining)) : "imali eqikelelwayo eshiyekayo eyi-" + rand(remaining);
        return "Ngokwemali oyinikeleyo, imali eshiyekayo ngaphambi kokuhlawula amatyala yi-" + rand(beforeDebt) + ". Emva kwezavenge zamatyala, iinkcukacha zibonisa " + result + ". Olu luqikelelo lwexeshana kuphela, hayi uvavanyo olusemthethweni lokukwazi ukuhlawula okanye isiqinisekiso sokufaneleka. Qinisekisa le mali ngovavanyo olukhuselekileyo.";
      }
      const result = remaining < 0 ? "a monthly shortfall of " + rand(Math.abs(remaining)) : "an indicative amount remaining of " + rand(remaining);
      return "Using the figures you provided, the amount before debt repayments is " + rand(beforeDebt) + ". After current monthly debt instalments, the figures indicate " + result + ". This is a provisional estimate, not an official affordability assessment, approved offer or guarantee of eligibility. Confirm the figures through a secure assessment with a qualified professional.";
    }

    const intents = [
      { keywords: ["what is debt review", "debt review", "debt counselling", "debt counseling", "over indebted", "overindebted", "wat is skuldhersiening", "skuldhersiening", "yintoni uphononongo lwamatyala"], answer: { en: "Debt review, also called debt counselling, is a process under South Africa's National Credit Act 34 of 2005. A registered debt counsellor assesses income, expenses and credit agreements to determine whether a consumer may be over-indebted and which options may be appropriate. Debt review does not erase debt, and eligibility or a particular repayment outcome is never guaranteed.", af: "Skuldhersiening, ook skuldberading genoem, is ’n proses ingevolge Suid-Afrika se Nasionale Kredietwet 34 van 2005. ’n Geregistreerde skuldberader beoordeel inkomste, uitgawes en kredietooreenkomste om vas te stel of jy moontlik oorverskuldig is. Dit skryf nie skuld af nie en kwalifikasie word nie gewaarborg nie.", xh: "Uphononongo lwamatyala yinkqubo ephantsi koMthetho weSizwe weTyala waseMzantsi Afrika ka-34 ka-2005. Umcebisi wamatyala obhalisiweyo uvavanya ingeniso, iindleko nezivumelwano zetyala. Aluwacimi amatyala kwaye ukufaneleka akuqinisekiswa." } },
      { keywords: ["how does it work", "process", "steps", "start debt review", "assessment", "what happens", "hoe werk", "die proses", "isebenza njani", "inkqubo"], answer: { en: "An assessment usually reviews employment and income, household expenses, each credit agreement, the reason payments became difficult and any existing legal or debt-review status. Supporting documents are then checked. A proposal is not automatically approved or binding.", af: "’n Assessering kyk na werk, inkomste, huishoudelike uitgawes, kredietooreenkomste, veranderde omstandighede en enige bestaande regs- of skuldhersieningstatus. Dokumente word nagegaan en ’n voorstel is nie vanself goedgekeur nie.", xh: "Uvavanyo luqwalasela umsebenzi, ingeniso, iindleko zasekhaya, izivumelwano zetyala nesizathu sokuba kube nzima ukuhlawula. Amaxwebhu ahlolwa, kwaye isindululo asibopheleli ngokuzenzekelayo." } },
      { keywords: ["what documents", "documents needed", "documents required", "payslip", "bank statement", "proof of income", "dokumente", "bankstate", "amaxwebhu", "ubungqina bengeniso"], answer: { en: "An assessment may require recent payslips or proof of income, recent bank statements, proof of address, statements for each credit agreement, a monthly expense list and any summonses or debt-review documents. Requirements vary. Do not upload unredacted documents or sensitive details in this chat.", af: "’n Assessering kan onlangse payslippe, bewys van inkomste, bankstate, adresbewys, skuldkonto-rekeninge, ’n maandelikse uitgawelys en regs- of vorige skuldhersieningdokumente vereis. Deel geen ongeredigeerde dokumente of bankbesonderhede in hierdie klets nie.", xh: "Uvavanyo lusenokufuna ubungqina bengeniso, iisitatimenti zebhanki, isazisi sendawo, iingxelo zamatyala, uluhlu lweendleko namaxwebhu asemthethweni. Musa ukuthumela amaxwebhu angafihlwanga kule ncoko." } },
      { keywords: ["affordability", "calculate affordability", "how much can i afford", "monthly budget", "bekostigbaarheid", "budget", "ukukwazi ukuhlawula"], answer: { en: "Subtract reasonable monthly living expenses from net household income, then subtract current monthly debt instalments. This provides only an indicative budget. It is not an official affordability assessment or approved repayment offer.", af: "Trek redelike maandelikse lewenskoste af van netto huishoudelike inkomste en trek dan huidige skuldpaaiemente af. Dit is ’n aanduidende begroting, nie ’n amptelike assessering of goedgekeurde terugbetalingsaanbod nie.", xh: "Thabatha iindleko zasekhaya ezifanelekileyo kwingeniso yonke engenayo, emva koko thabatha iintlawulo zamatyala zenyanga. Olu luqikelelo nje, hayi uvavanyo olusemthethweni okanye isindululo esivunyiweyo." } },
      { keywords: ["credit agreement", "credit agreements", "creditors", "debt balances", "arrears", "krediteure", "skuld saldo", "amatyala"], answer: { en: "List each credit agreement separately with the creditor, balance, instalment and any arrears where known. Include personal loans, credit cards, store accounts, vehicle finance, home loans and overdrafts. Mark unknown amounts as unconfirmed.", af: "Lys elke kredietooreenkoms apart met die skuldeiser, saldo, paaiement en agterstallige bedrag indien bekend. Sluit persoonlike lenings, kredietkaarte, winkelrekeninge, voertuigfinansiering, huislenings en oortrekkings in.", xh: "Bhala isivumelwano ngasinye setyala kunye nenkampani enikwelisayo, ibhalansi, isavenge nemali eshiyekileyo xa iyaziwa. Yongeza zonke iimali-mboleko neeakhawunti zetayala." } },
      { keywords: ["income", "salary", "net income", "gross income", "proof of income", "salaris", "inkomste", "ingeniso", "umvuzo"], answer: { en: "An assessment may consider employment status, gross and net income, deductions, overtime, bonuses and other household contributions. Keep confirmed figures separate from estimates. Sensitive payslips should be shared only through a secure, authorised channel.", af: "’n Assessering kan werkstatus, bruto en netto inkomste, aftrekkings, oortyd, bonusse en huishoudelike bydraes oorweeg. Hou bevestigde bedrae apart van beramings.", xh: "Uvavanyo lusenokuqwalasela imeko yomsebenzi, ingeniso ephambi nasemva kokutsalwa, iimali ezongezelelweyo neminikelo yasekhaya. Iinkcukacha ezithathwa njengokubuthathaka zingabelwana kuphela ngendlela ekhuselekileyo." } },
      { keywords: ["expenses", "household expenses", "monthly costs", "rent", "utilities", "dependants", "uitgawes", "huishoudelike uitgawes", "iindleko zasekhaya"], answer: { en: "A monthly budget may include housing, food, utilities, transport, medical and insurance costs, dependants, school fees and maintenance. Use genuine amounts and estimate irregular costs across a month rather than omitting them.", af: "’n Maandelikse begroting kan behuising, kos, nutsdienste, vervoer, mediese en versekeringskoste, afhanklikes, skoolgeld en onderhoud insluit. Gebruik werklike bedrae.", xh: "Uhlahlo-lwabiwo mali lunokubandakanya indlu, ukutya, amanzi nombane, uthutho, iyeza ne-inshorensi, abantwana, iifizi zesikolo nesondlo. Sebenzisa iimali ezichanekileyo." } },
      { keywords: ["how long", "duration", "timeline", "how long does", "hoe lank", "ixesha elingakanani"], answer: { en: "There is no fixed timeline. Assessment time, creditor responses, court or tribunal steps and the amount owed may all affect timing. The team can provide an estimate after reviewing the case.", af: "Daar is geen vaste tydlyn nie. Die assessering, skuldeiser-antwoorde, hof- of tribunaalstappe en die bedrag wat geskuld word beïnvloed die tydsduur.", xh: "Akukho xesha elimiselweyo. Uvavanyo, iimpendulo zababolekisi, iinkqubo zenkundla nobungakanani betyala zinokuchaphazela ixesha." } },
      { keywords: ["cost", "fee", "fees", "price", "payment distribution", "fooie", "koste", "iindleko zenkonzo"], answer: { en: "Fees and payment-distribution arrangements vary. Request a written breakdown of every fee, what it covers, how payments are distributed and when it applies before agreeing. Do not rely on a chatbot for an approved repayment amount.", af: "Fooie en betalingsverspreiding verskil. Vra ’n skriftelike uiteensetting van elke fooi, die diens wat dit dek en hoe betalings versprei word voordat jy instem.", xh: "Iintlawulo nendlela iimali ezisasazwa ngayo ziyahluka. Cela inkcazo ebhaliweyo ngentlawulo nganye nangeenkonzo phambi kokuvuma." } },
      { keywords: ["summons", "court", "letter of demand", "judgment", "garnishee", "enforcement", "dagvaarding", "hof", "isamani", "inkundla", "isigwebo"], answer: { en: "Debt review does not automatically stop every collection, enforcement or court process. A summons, judgment or termination notice can be time-sensitive. Do not ignore deadlines; contact the team or a suitably qualified South African legal professional promptly.", af: "Skuldhersiening stop nie outomaties elke invorderings-, afdwingings- of hofproses nie. Kontak dadelik ’n geregistreerde skuldberader of gekwalifiseerde regskenner indien daar ’n dagvaarding of regskennisgewing is.", xh: "Uphononongo lwamatyala aluyeki ngokuzenzekelayo yonke inkqubo yokuqokelela okanye yenkundla. Ukuba unesamani okanye isaziso somthetho, yichaze ngokukhawuleza kumcebisi obhalisiweyo okanye kwigqwetha elifanelekileyo." } },
      { keywords: ["cancel", "withdraw", "exit", "transfer counsellor", "change counsellor", "kanselleer", "onttrek", "tshintsha umcebisi"], answer: { en: "Withdrawal or transfer may depend on the process stage, court or tribunal orders and applicable law. Do not stop payments or rely on an assumed quick removal. Ask a registered debt counsellor or qualified legal professional about the specific case.", af: "Onttrekking of oordrag hang van die prosesstadium, hof- of tribunaalbeveel en die wet af. Moenie betalings staak nie; vra ’n geregistreerde skuldberader of regskenner.", xh: "Ukuphuma okanye ukudlulisela komnye umcebisi kuxhomekeke kwinqanaba lenkqubo nakumthetho. Musa ukuyeka iintlawulo ngaphandle kokuqinisekisa." } },
      { keywords: ["clearance certificate", "form 19", "paid off", "completed debt review", "klaringsertifikaat", "vorm 19", "isatifikethi", "ifomu 19"], answer: { en: "A clearance certificate, including NCR Form 19 where applicable, is issued only when the statutory requirements for the case are met. Your registered debt counsellor can explain the steps and credit-bureau updates.", af: "’n Klaringsertifikaat, insluitend NCR-vorm 19 waar van toepassing, word slegs uitgereik wanneer die statutêre vereistes nagekom is. Jou skuldberader kan die stappe verduidelik.", xh: "Isatifikethi sokugqiba, kuquka iFomu 19 ye-NCR xa kufuneka, sikhutshwa kuphela xa iimfuno zomthetho zizalisekile. Umcebisi wamatyala unganika iinkcukacha." } },
      { keywords: ["dispute balance", "wrong balance", "incorrect debt", "reckless credit", "complaint", "ncr complaint", "klagte", "betwis die saldo", "isikhalazo"], answer: { en: "Keep copies of statements and correspondence, and record dates and reference numbers. A balance dispute or reckless-credit claim requires review of the facts and evidence. This bot cannot decide it; contact a qualified professional or the National Credit Regulator where appropriate.", af: "Bewaar afskrifte van state en korrespondensie. ’n Saldogeskil of roekelose-krediet eis vereis feite- en bewysbeoordeling; die Nasionale Kredietreguleerder kan toepaslik gekontak word.", xh: "Gcina iikopi zezitatimenti neembalelwano, ubhale imihla neenombolo zesalathiso. Ibango elifuna ukuvavanywa ngunyango lwamabango; qhagamshelana nengcali okanye i-NCR xa kufanelekile." } },
      { keywords: ["contact", "phone", "whatsapp", "human", "agent", "speak to", "kontak", "telefoon", "qhagamshelana", "umnxeba"], answer: { en: "You can contact Debt Settlement Partners through the Contact page, call +27 76 824 7432, or use WhatsApp at https://wa.me/27664022432. Do not share ID numbers, bank details, passwords or account numbers in this chat.", af: "Kontak Debt Settlement Partners via die Kontak-bladsy, bel +27 76 824 7432 of WhatsApp https://wa.me/27664022432. Deel geen ID-nommer, bankbesonderhede, wagwoorde of rekeningnommers hier nie.", xh: "Qhagamshelana ne-Debt Settlement Partners kwiphepha loNxibelelwano, faka umnxeba ku-+27 76 824 7432 okanye WhatsApp ku-https://wa.me/27664022432. Musa ukwabelana ngenombolo yesazisi okanye iinkcukacha zebhanki." } },
      { keywords: ["privacy", "id number", "bank details", "password", "otp", "pin", "secure channel", "privaatheid", "ukhuseleko lweenkcukacha"], answer: { en: "Do not share a full ID number, banking details, passwords, PINs, card codes or one-time passwords in this general chat. Use a secure, authorised channel for sensitive information or documents.", af: "Moet nie ’n volle ID-nommer, bankbesonderhede, wagwoorde, PIN’s, kaartkodes of eenmalige wagwoorde in hierdie klets deel nie. Gebruik ’n veilige, goedgekeurde kanaal.", xh: "Ungabelani ngenombolo yesazisi epheleleyo, iinkcukacha zebhanki, amagama ayimfihlo, ii-PIN okanye ii-OTP. Sebenzisa indlela ekhuselekileyo nevunyiweyo." } },
      { keywords: ["hello", "hi", "hey", "good morning", "hallo", "goeie", "molo", "molweni", "enkosi"], answer: { en: "Hello! I can explain South African debt review, income and expense preparation, credit agreements, documents, affordability and next steps. I cannot provide a formal assessment or legal decision.", af: "Hallo! Ek kan algemene vrae oor Suid-Afrikaanse skuldhersiening, inkomste, uitgawes, dokumente, bekostigbaarheid en volgende stappe beantwoord.", xh: "Molo! Ndingaphendula imibuzo ngokubanzi ngophononongo lwamatyala eMzantsi Afrika, ingeniso, iindleko, amaxwebhu namanyathelo alandelayo." } }
    ];

    const ranked = intents.map(function (intent) {
      let score = 0;
      intent.keywords.forEach(function (keyword) {
        if (normalized.includes(" " + keyword + " ")) score += keyword.trim().split(" ").length + 1;
      });
      return { score: score, answer: intent.answer[language] || intent.answer.en };
    }).sort(function (a, b) { return b.score - a.score; });

    if (ranked[0].score > 0) return ranked[0].answer;
    if (language === "af") return "Ek is nie seker oor daardie spesifieke vraag nie. Ek kan algemene inligting oor skuldhersiening gee. Kontak die span via https://wa.me/27664022432 of die Kontak-bladsy.";
    if (language === "xh") return "Andiqinisekanga ngalo mbuzo uthile. Ndinganika ulwazi ngokubanzi ngophononongo lwamatyala. Qhagamshelana neqela ku-https://wa.me/27664022432 okanye kwiphepha loNxibelelwano.";
    return "I don't have a reliable answer for that yet. The team can help with your specific question through the Contact page or WhatsApp: https://wa.me/27664022432.";
  }

  launcher.addEventListener("click", function () { setChatOpen(true); });
  closeButton.addEventListener("click", function () { setChatOpen(false); });

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    addMessage(question, "user");
    chatInput.value = "";
    window.setTimeout(function () { addMessage(getChatResponse(question), "bot"); }, 250);
  });

  suggestions.addEventListener("click", function (event) {
    const button = event.target.closest(".chat-suggestion");
    if (!button) return;
    const question = button.dataset.question;
    addMessage(question, "user");
    button.remove();
    window.setTimeout(function () { addMessage(getChatResponse(question), "bot"); }, 250);
  });

  if (window.innerWidth < 992) setChatOpen(false);
});