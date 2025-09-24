export default function Footer() {
    return (
        <>
            <div className="container m-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">О проекте</h3>
                    <p className="text-sm leading-relaxed">
                        Chronicles — это платформа для обмена идеями, новостями и вдохновением. Здесь мы делимся мыслями
                        и создаём комьюнити.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Ссылки</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="#" className="hover:text-white">
                                Главная
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                О нас
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                Блог
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                Контакты
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Ресурсы</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="#" className="hover:text-white">
                                Документация
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                Поддержка
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                Партнёры
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-white">
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Мы в соцсетях</h3>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white">
                            Twitter
                        </a>
                        <a href="#" className="hover:text-white">
                            Instagram
                        </a>
                        <a href="#" className="hover:text-white">
                            YouTube
                        </a>
                    </div>
                </div>
            </div>

            <div className="border-t border-zinc-800 py-4 text-center text-sm text-zinc-500">
                © 2025 Chronicles. Все права защищены.
            </div>
        </>
    )
}
