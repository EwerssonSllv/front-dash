import Image from "next/image";
import logoDash from "../../images/Dash.png"

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center -mb-1 gap-2">
                            <Image
                                src={logoDash}
                                alt="Logo"
                                height={90}
                                className="-ml-10 "
                            />
                            <span className="-ml-10 text-xl font-bold text-white">Dashlyze</span>
                        </div>
                        <p className="text-gray-400">
                            Gestão inteligente de estoque e vendas para o seu negócio
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Produto</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Empresa</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Suporte</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p>&copy; 2026 Dashlyze. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}