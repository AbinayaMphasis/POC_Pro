export interface ConsentEntry {
  drugName: string;
  type: 'patient' | 'physician';
  consent: string;
}

export const AllConsents: ConsentEntry[] = [
  {
    drugName: 'DrugOne',
    type: 'patient',
    consent: `
      <p>
        I, the patient (or authorized representative), hereby voluntarily consent to the
        administration of <strong>DrugOne</strong> as part of my treatment plan at
        <strong>Apollo Hospitals</strong>. I understand that:
      </p>
      <ul>
        <li>DrugOne is prescribed to manage my diagnosed condition and its expected benefits have been explained to me.</li>
        <li>Possible side effects of DrugOne include nausea, dizziness, and fatigue. Rare but serious reactions have been disclosed.</li>
        <li>I must inform my physician of any allergies, current medications, or adverse reactions experienced during the course of treatment.</li>
        <li>I have the right to refuse or discontinue DrugOne at any time without prejudice to my ongoing care.</li>
        <li>My personal and medical information may be used for treatment, billing, and regulatory reporting purposes in accordance with hospital privacy policies.</li>
      </ul>
      <p class="consent-footer-note">
        By selecting <strong>Yes</strong> below, you confirm that you have read, understood, and
        agree to the terms stated above regarding <strong>DrugOne</strong>.
      </p>
    `
  },
  {
    drugName: 'DrugOne',
    type: 'physician',
    consent: `
      <p>
        I, the prescribing physician, confirm that I have explained the nature, purpose, risks,
        and alternatives of <strong>DrugOne</strong> therapy to the patient (or authorized
        representative). I attest that:
      </p>
      <ul>
        <li>The patient has been evaluated and meets the clinical criteria for DrugOne treatment.</li>
        <li>All relevant contraindications and drug interactions have been reviewed.</li>
        <li>The patient has been given adequate opportunity to ask questions and has expressed understanding of the treatment.</li>
        <li>Monitoring protocols specific to DrugOne have been initiated and documented.</li>
      </ul>
      <p class="consent-footer-note">
        By signing below, the physician certifies that informed consent for <strong>DrugOne</strong>
        has been obtained in accordance with institutional and regulatory guidelines.
      </p>
    `
  },
  {
    drugName: 'DrugTwo',
    type: 'patient',
    consent: `
      <p>
        I, the patient (or authorized representative), hereby voluntarily consent to the
        administration of <strong>DrugTwo</strong> as part of my treatment plan at
        <strong>Apollo Hospitals</strong>. I understand that:
      </p>
      <ul>
        <li>DrugTwo is an injectable medication and will be administered under clinical supervision.</li>
        <li>Common side effects may include injection-site reactions, headache, and mild gastrointestinal discomfort.</li>
        <li>I must remain at the facility for a post-administration observation period as determined by my physician.</li>
        <li>I agree to follow the prescribed dosage schedule and attend all follow-up appointments related to DrugTwo therapy.</li>
        <li>I have the right to refuse or withdraw consent at any time without prejudice to my care.</li>
      </ul>
      <p class="consent-footer-note">
        By selecting <strong>Yes</strong> below, you confirm that you have read, understood, and
        agree to the terms stated above regarding <strong>DrugTwo</strong>.
      </p>
    `
  },
  {
    drugName: 'DrugTwo',
    type: 'physician',
    consent: `
      <p>
        I, the prescribing physician, confirm that I have explained the nature, purpose, risks,
        and alternatives of <strong>DrugTwo</strong> therapy to the patient (or authorized
        representative). I attest that:
      </p>
      <ul>
        <li>A complete medical history review and baseline lab work have been performed prior to initiating DrugTwo.</li>
        <li>The patient has been informed about the injection procedure and post-administration monitoring requirements.</li>
        <li>All known drug interactions relevant to DrugTwo have been assessed and documented.</li>
        <li>An adverse-event response plan specific to DrugTwo has been established.</li>
      </ul>
      <p class="consent-footer-note">
        By signing below, the physician certifies that informed consent for <strong>DrugTwo</strong>
        has been obtained in accordance with institutional and regulatory guidelines.
      </p>
    `
  }
];
