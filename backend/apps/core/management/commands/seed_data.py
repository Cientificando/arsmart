from django.core.management.base import BaseCommand

from apps.catalog.models import BusinessArea, Service, ServiceCategory
from apps.company.models import CompanyProfile, CompanyValue, FAQ
from apps.procurement.models import ProductCategory
from apps.software.models import SoftwareSolution


class Command(BaseCommand):
    help = "Cria/actualiza os dados reais e confirmados da ARSMART (sem inventar factos)."

    def handle(self, *args, **options):
        self._seed_company_profile()
        self._seed_company_values()
        self._seed_service_categories_and_services()
        self._seed_software()
        self._seed_product_categories()
        self._seed_business_areas()
        self._seed_faqs()
        self.stdout.write(self.style.SUCCESS("Seed concluído."))

    def _seed_company_profile(self):
        profile, _ = CompanyProfile.objects.get_or_create(pk=1)
        profile.legal_name = "ARSMART - COMÉRCIO GERAL E PRESTAÇÃO DE SERVIÇOS (SU), LDA"
        profile.trade_name = "ARSMART"
        profile.nif = "5002476959"
        profile.registration_number = "13222-25/250420"
        profile.legal_form = "Sociedade Unipessoal por Quotas (SU, LDA)"
        profile.founded_year = 2025
        profile.capital = 100000.00
        profile.address = (
            "Bairro Centro Urbano, Rua Principal do Centro Urbano, casa s/n.º, "
            "nas imediações da ENDE-Dundo e Largo Samanhoga"
        )
        profile.province = "Lunda Norte"
        profile.municipality = "Dundo"
        profile.country = "Angola"
        profile.phone = "923 766 892"
        profile.whatsapp = "+244923766892"
        profile.email = "aristidethidewalla@gmail.com"
        profile.description = (
            "A ARSMART presta serviços empresariais e tecnológicos, disponibiliza soluções "
            "de software e apoia clientes na obtenção de produtos e soluções através de "
            "fornecimento sob solicitação."
        )
        profile.mission = (
            "Prestar serviços e disponibilizar soluções que respondam de forma eficiente às "
            "necessidades de empresas, organizações e clientes, combinando capacidade "
            "operacional, tecnologia e atendimento orientado às necessidades de cada cliente."
        )
        profile.vision = (
            "Tornar-se uma referência em prestação de serviços e soluções empresariais em "
            "Angola, reconhecida pela capacidade de resposta, confiança e qualidade das "
            "soluções disponibilizadas aos seus clientes."
        )
        profile.save()
        self.stdout.write(self.style.SUCCESS("Perfil da empresa actualizado com dados confirmados."))

    def _seed_company_values(self):
        values = [
            ("Confiança", "Construir relações profissionais baseadas em transparência e responsabilidade."),
            ("Compromisso", "Assumir cada necessidade do cliente com seriedade e acompanhamento."),
            ("Profissionalismo", "Executar cada serviço com organização, competência e responsabilidade."),
            ("Solução", "Procurar respostas concretas para necessidades reais."),
            ("Inovação", "Utilizar tecnologia e novas abordagens para melhorar os serviços prestados."),
            ("Integridade", "Actuar com transparência e respeito pelos compromissos assumidos."),
        ]
        for order, (name, desc) in enumerate(values):
            CompanyValue.objects.update_or_create(name=name, defaults={"description": desc, "order": order})
        self.stdout.write(self.style.SUCCESS(f"{len(values)} valores institucionais garantidos."))

    def _seed_service_categories_and_services(self):
        categories = {
            "Informática e Tecnologia": (
                "Serviços de informática e soluções tecnológicas destinados a apoiar empresas "
                "e organizações nas suas necessidades digitais e operacionais."
            ),
            "Contabilidade e Serviços Empresariais": (
                "Prestação de serviços contabilísticos e apoio às necessidades de gestão e "
                "organização empresarial."
            ),
            "Consultoria": (
                "Serviços de consultoria orientados para as necessidades específicas de "
                "empresas e organizações."
            ),
        }
        category_objs = {}
        for order, (name, desc) in enumerate(categories.items()):
            cat, _ = ServiceCategory.objects.update_or_create(
                name=name, defaults={"description": desc, "order": order}
            )
            category_objs[name] = cat
        self.stdout.write(self.style.SUCCESS(f"{len(category_objs)} categorias de serviço garantidas."))

        services = [
            ("Informática e Tecnologia", "Informática e Tecnologia", categories["Informática e Tecnologia"]),
            (
                "Contabilidade e Serviços Empresariais",
                "Contabilidade e Serviços Empresariais",
                categories["Contabilidade e Serviços Empresariais"],
            ),
            ("Consultoria", "Consultoria", categories["Consultoria"]),
        ]
        for name, cat_name, short_desc in services:
            Service.objects.update_or_create(
                name=name,
                defaults={
                    "category": category_objs[cat_name],
                    "short_description": short_desc,
                    "full_description": short_desc,
                    "is_featured": True,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"{len(services)} serviços principais garantidos."))

    def _seed_software(self):
        SoftwareSolution.objects.update_or_create(
            name="NEGOMIL",
            defaults={
                # Fabricante/desenvolvedor não confirmado — não inventar.
                "developer": "",
                "category": "Software de Gestão Empresarial",
                "short_description": (
                    "Solução de software de gestão comercializada pela ARSMART para apoiar "
                    "empresas na gestão das suas operações."
                ),
                "full_description": (
                    "Solução de software de gestão comercializada pela ARSMART para apoiar "
                    "empresas na gestão das suas operações. Funcionalidades, requisitos e "
                    "modalidade de licença detalhados a confirmar e completar pelo "
                    "administrador."
                ),
                "license_type": SoftwareSolution.License.QUOTE_ONLY,
                "price_note": "Sob consulta",
                "is_featured": True,
            },
        )
        self.stdout.write(self.style.SUCCESS("Software NEGOMIL garantido (sem funcionalidades inventadas)."))

    def _seed_product_categories(self):
        categories = [
            "Informática e Tecnologia",
            "Equipamentos",
            "Material de Escritório",
            "Material Escolar",
            "Materiais de Construção",
            "Equipamentos e Acessórios Automóveis",
            "Electrodomésticos",
            "Equipamentos Hospitalares",
            "Equipamentos Laboratoriais",
            "Sistemas de Tratamento e Purificação de Água",
            "Outros Produtos e Materiais",
        ]
        for order, name in enumerate(categories):
            ProductCategory.objects.update_or_create(name=name, defaults={"order": order})
        self.stdout.write(self.style.SUCCESS(f"{len(categories)} categorias de fornecimento garantidas."))

    def _seed_business_areas(self):
        S = BusinessArea.Status
        areas = [
            ("Informática e Tecnologia", S.ACTIVE),
            ("Software de Gestão", S.ACTIVE),
            ("Contabilidade e Serviços Empresariais", S.ACTIVE),
            ("Consultoria", S.ACTIVE),
            ("Fornecimento sob Solicitação", S.ACTIVE),
            ("Comércio Geral", S.AVAILABLE_ON_REQUEST),
            ("Construção e Infraestruturas", S.CONSULTATION),
            ("Educação e Formação", S.CONSULTATION),
            ("Agricultura e Pecuária", S.CONSULTATION),
            ("Pesca e Aquicultura", S.CONSULTATION),
            ("Água e Saneamento", S.CONSULTATION),
            ("Saúde e Equipamentos", S.CONSULTATION),
            ("Automóvel e Mobilidade", S.CONSULTATION),
            ("Imobiliário", S.CONSULTATION),
            ("Hotelaria e Restauração", S.CONSULTATION),
            ("Publicidade e Criatividade", S.CONSULTATION),
            ("Outros Serviços", S.CONSULTATION),
        ]
        for order, (name, status) in enumerate(areas):
            BusinessArea.objects.update_or_create(name=name, defaults={"status": status, "order": order})
        self.stdout.write(self.style.SUCCESS(f"{len(areas)} áreas de actuação garantidas."))

    def _seed_faqs(self):
        faqs = [
            (
                "Como posso solicitar um serviço?",
                "Pode utilizar o formulário de solicitação disponível no website ou contactar "
                "directamente a ARSMART através dos canais disponibilizados.",
            ),
            (
                "A ARSMART fornece produtos que não aparecem no website?",
                "Sim. A ARSMART trabalha também com fornecimento sob solicitação. Envie a sua "
                "necessidade para que a equipa possa analisar a possibilidade de obtenção e "
                "fornecimento.",
            ),
            (
                "Como posso solicitar um produto?",
                "Utilize a opção 'Solicitar fornecimento', indique o produto pretendido, "
                "quantidade e especificações relevantes. A equipa analisará o pedido e "
                "entrará em contacto.",
            ),
            (
                "A ARSMART comercializa software?",
                "Sim. A ARSMART disponibiliza e comercializa soluções de software de gestão, "
                "incluindo a solução NEGOMIL.",
            ),
            (
                "Como posso solicitar uma demonstração da NEGOMIL?",
                "Utilize o formulário de solicitação de demonstração e indique os seus dados "
                "de contacto. A equipa da ARSMART entrará em contacto para dar seguimento ao "
                "pedido.",
            ),
            (
                "A ARSMART vende produtos directamente pelo website?",
                "O website não funciona como uma loja online tradicional. Os produtos são "
                "tratados através de um modelo de fornecimento sob solicitação.",
            ),
        ]
        for order, (question, answer) in enumerate(faqs):
            FAQ.objects.update_or_create(question=question, defaults={"answer": answer, "order": order})
        self.stdout.write(self.style.SUCCESS(f"{len(faqs)} FAQs oficiais garantidas."))
