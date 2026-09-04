import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    const anoEl = document.getElementById('anoAtual');
    if (anoEl) anoEl.textContent = String(new Date().getFullYear());

    const form = document.getElementById('vemForm') as HTMLFormElement | null;
    if (form) form.addEventListener('submit', event => this.submitForm(event, form));
  }

  private setFieldError(fieldId: string, message: string | null): void {
    const input = document.getElementById(fieldId) as HTMLInputElement | null;
    const errorEl = document.getElementById(`erro-${fieldId}`);
    input?.classList.toggle('is-invalid', !!message);
    if (errorEl) errorEl.textContent = message || '';
    if (message) input?.setAttribute('aria-invalid', 'true'); else input?.removeAttribute('aria-invalid');
  }

  private submitForm(event: Event, form: HTMLFormElement): void {
    event.preventDefault();
    const get = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
    const data = {
      nome: get('nome').value, email: get('email').value, whatsapp: get('whatsapp').value,
      cidade: get('cidade').value, mudanca: get('mudanca').value,
      consentimento: (get('consentimento') as HTMLInputElement).checked
    };
    let valid = true;
    const check = (id: string, msg: string | null) => { this.setFieldError(id, msg); if (msg) valid = false; };
    check('nome', data.nome.trim() ? null : 'Conta pra gente o seu nome.');
    check('email', !data.email.trim() ? 'Precisamos do seu e-mail.' : !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email.trim()) ? 'Esse e-mail não parece completo.' : null);
    const digits = data.whatsapp.replace(/\\D/g, '');
    check('whatsapp', !data.whatsapp.trim() ? 'Informe seu WhatsApp com DDD.' : digits.length < 10 || digits.length > 11 ? 'Confira o número — inclua o DDD.' : null);
    check('cidade', data.cidade.trim() ? null : 'Conta pra gente sua cidade e estado.');
    check('consentimento', data.consentimento ? null : 'Marque a caixa pra gente poder te avisar.');
    const status = document.getElementById('formStatus');
    if (!valid) { if (status) status.textContent = 'Confira os campos destacados acima.'; return; }
    const btn = document.getElementById('submitBtn') as HTMLButtonElement | null;
    if (status) status.textContent = 'Enviando...';
    if (btn) { btn.disabled = true; const label = btn.querySelector('.btn__label'); if (label) label.textContent = 'Enviando...'; }
    // Simulação local. O próximo passo é trocar isto por POST na malu-diaz-api.
    setTimeout(() => {
      form.hidden = true;
      if (status) status.textContent = '';
      const success = document.getElementById('formSuccess');
      if (success) { success.hidden = false; success.setAttribute('tabindex', '-1'); success.focus(); }
    }, 900);
  }
}
