import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-amber-100 py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-amber-900">Maktabim+</span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              65-maktab uchun maxsus raqamli platforma
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-3">Platforma</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <a href="#features" className="hover:text-amber-700">
                  Imkoniyatlar
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-700">
                  Narxlar
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-700">
                  Savollar
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-3">Aloqa</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>📱 Telegram: @maktabim65</li>
              <li>📧 info@maktabim.uz</li>
              <li>☎️ +998 90 000 00 00</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-3">Huquqiy</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li>
                <a href="#" className="hover:text-amber-700">
                  Shartlar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700">
                  Maxfiylik
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500">
            © 2026 Maktabim+ · Barcha huquqlar himoyalangan
          </p>
          <p className="text-sm text-stone-400">
            🍂 Kuzgi iliqlik bilan yaratildi
          </p>
        </div>
      </div>
    </footer>
  );
}