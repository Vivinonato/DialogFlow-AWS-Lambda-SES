DialogFlow + AWS Lambda + SES
Viviane Nonato


O objetivo deste artigo é compartilhar as etapas necessárias para executar o Webhook de Fufillment no bot do Dialogflow utilizando AWS Lambda e o Amazon SES.

Vamos desenvolver funções básicas de blocos de construção que você pode estender para criar o chatbot completo com o Dialogflow , AWS Lambda e o SES.
Pré-requisitos:

    Conta do Google Cloud (ATENÇÃO: o agente Dialogflow está vinculado a um projeto do Google Cloud)
    Conta do Dialogflow
    Conta da AWS
    Node.js e npm runtime.

Arquitetura do desafio

O Dialogflow vem com seu próprio editor Inline, com o Cloud Functions do Firebase for Intent Webhook. Quando o número de Intents do bot aumenta ao longo do tempo, torna-se mais difícil editá-lo no Inline Editor. Por isso, é melhor hospedá-lo em algumas soluções de FaaS (função como serviço), para isto vamos utilizar a platafoma da AWS, o Lambda!

Analise a imagem abaixo pois define a arquitetura que tentaremos alcançar.
Imagem de estudo

A partir do diagrama, ele mostra que o Dialogflow enviará solicitações ao API Gateway junto com as credenciais básicas. O API Gateway usa o Lambda Authorizer para autorizar e autenticar e encaminhar a solicitação para a função Fulfillment Handler Lambda.

Como o Dialogflow Fulfillment Library pode ser criado com o objeto de resposta e solicitação HTTP do ExpressJS, o código existente do Cloud Function Firebase pode ser facilmente agrupado com ExpressJs e implantado no Lambda.
1. Crie seu bot de Dialogflow

Entre no seu Dialogflow e crie um novo agente.
2. Habilitar Webhook do Fufillment

Selecione Intenção de Boas-Vindas Padrão, apenas modificaremos essa intenção. Role para baixo até a seção Fufillmeent e clique em “Enable webhook call for this intent”.
3. Crie o AWS Lambda e de Deploy

    Vá até sua conta da AWS.

Crie a função do AWS Lambda”AWS Lambda function”. Selecione Autor do zero. Preencha o nome da função. Selecione o tempo de execução do Node.js 8.10. E selecione Create a custom role”” em função. Ele levará você para a próxima página para criar um custom role.

    Preencha o Nome da Função e clique em Salvar. Então, de volta na página e click em Create function.
    Após a criação do Lambda, clone meu repositório no GitHub:

git clone https://github.com/Vivinonato/DialogFlow-AWS-Lambda-SES

    Crie diretorios com os nomes dialogflow-aws-lambda / dialogflow-webhook e execute a instalação do npm.
    Em seguida, sob o diretório dialogflow-webhook, copie todos os arquivos e pastas, incluindo os node_modules. Se você tem terminal, execute

zip -r dialogflow-webhook.zip *.

No AWS Console, na função Lambda criada anteriormente, selecione “Fazer upload de um arquivo .zip” e selecione o arquivo zip que você acabou de criar.

    Defina o tempo limite para a função, dependendo do tamanho da carga de trabalho que sua função estará executando.

4. Crie a função do autor do Lambda.

    Crie outro Lambda. Mas desta vez, em vez de carregar o zip, você pode copiar e colar o código-fonte.
    Na pasta clonada git anterior, arquivo api-gateway-authorizer, no arquivo index.js, localize e atualize os textos <USERNAME> e <PASSWORD> com seus próprios valores, que serão usados ​​pelo Dialogflow para autenticar a solicitação posteriormente, lembre-se que tem que ter uma conta no Google Clound.

Após a atualização, copie o código-fonte para o Lambda Inline Code Editor. Defina o Tempo limite do Lambda para pelo menos 1 minuto e salve.
5. Criar o GatewayAPI no AWS

No console da AWS, navegue até o API Gateway. Crie uma API. Digite o nome da sua API e deixe o restante como padrão e continue.

Clique em Actions > Create Method. Em seguida, selecione POST como método. Clique no botão de seleção para salvar.

Selecione o método Post, preencha os parâmetros necessários. Certifique-se de marcar Use Lambda Proxy integration. Então salve. Se ele solicitar “Add Permission to Lambda”, clique em OK.

Go to Authorizers > Create Authorizer.

    Preencha o Nome e o nome da Função Lambda para o Autorizador.

    Deixe o Lambda Invoke Role em branco.

Preencher Authorization de Token Source.. E clique em Criar.

Sob sua API, clique em Resources > POST > Method Request.

Para Autorização, selecione o autorizador criado anteriormente. Se não aparecer na lista, atualize a página.

Para finalizar click em Ações, clique em Deploy API.

Crie um novo Stage de implantação. Clique em Deploy.

    Em Stage, copie o URL Invoke.

6. URL do Webhook e Autenticação Básica no Fufillment do Dialogflow

Em Fulfilment, ative a alternância ENABLED, cole o URL do APIGateway e preencha username e password. Em seguida, role para baixo para clicar em Salvar.
Integração do Amazon SES
7. Edite o arquivo app.js da pasta dialogflow-webhook.

    Vamos criar uma função a mais para responder quando detectar o Intent de email, e adicionar o código do SES e fazer uploud.

8-Crie uma nova Intent com o nome envieEmail

No Amazon SES tem exemplos de códigos para serem utilizado em teste de disparo de email, mas o principal é você definir uma nova função em sua Intent, no arquivo app.js do webhook Lambda and SES, veja o exemplo a seguir.

intentMap.set(‘enviaEmail’, enviaEmail);

Para finalizar configure o Rule.

Não se esqueça de fazer deploy dos arquivos editados.

Agradecimento ao meu amigo Claudio e aos meus filhos!
