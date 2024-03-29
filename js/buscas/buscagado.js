/**Definicao das categorias 
 * https://cloud.cnpgc.embrapa.br/sac/2012/10/16/prezados-senhores-busquei-no-site-a-embrapa-e-nao-obtive-exito-1-onde-posso-obter-o-peso-medio-de-um-novilho-2-onde-posso-obter-o-peso-medio-de-um-boi-com-45-meses-3-um-novilho-e-considerado-no/
 */

/*---------------------------------------------------------------------*/
/*------------------------- CONTAGEM DE REBANHO ---------------------------*/
var urlM = "http://localhost:8080/gadobov/filtramachos";
var urlF = "http://localhost:8080/gadobov/filtrafemeas";

fetch(urlM).then(res => res.json()).then(resJ =>{
    var countM = 0;
    resJ.forEach(el =>{
        if(el.status == true){
            countM++;
        }
    })
    document.getElementById('qtdMacho').innerHTML = countM;
});

fetch(urlF).then(res => res.json()).then(resJ =>{
    var countF = 0;
    resJ.forEach(el =>{
        if(el.status == true){
            countF++;
        }
    })
    document.getElementById('qtdFemea').innerHTML = countF;
});



/*---------------------------------------------------------------------*/
/*------------------------- BUSCA REBANHO ---------------------------*/
var url = "http://localhost:8080/gadobov/buscatodos";

fetch(url).then(res => res.json()).then(resJ => {   
    if(resJ.length > 0){
        var strTable = "";
        var status = "";
        var categoria = "";
        var qtdDesativo = 0;

        strTable += '<tr>';
        strTable += '<th>Número do brinco</th>';
        strTable += '<th>Categoria</th>';
        strTable += '<th>Sexo</th>';
        strTable += '<th>Peso de Entrada</th>';
        strTable += '<th>Idade</th>';
        strTable += '<th>Situação</th>';
        strTable += '<th>Operações</th>';
        strTable += '</tr>';

        resJ.forEach(element => {

            if(element.status === true){ 
                status = "Ativo";
            } else {
                status = "Desativado";
                qtdDesativo++;
            };

            var dataLocal = new Date();
            var dataNascimento = new Date(element.dataNascimento);
            var idade = dateNascimento(dataNascimento, dataLocal);
            if(idade == 0){
                idade = "Menos de 1 mês";
            }
            if(element.sexo == "Macho"){
                if(idade <= 8){
                    if(idade == 1){
                        categoria = "Bezerro";
                        idade = "Menos de " + idade + " mês";
                    } else {
                        categoria = "Bezerro";
                        idade = idade + " meses";
                    }
                    
                } 
                if(idade >= 9 && idade <= 28){
                    categoria = "Novilho";
                    idade = idade + " meses";
                } 
                if(idade > 28 && idade <= 60){
                    categoria = "Boi";
                    idade = idade + " meses";
                } 
                if(idade > 60){
                    categoria = "Touruno";
                    idade = idade + " meses";
                }
            } else {
                categoria = element.categoriaAnimal;
                idade = idade + " meses";
            }

            var arroba = 0;
            var pesoVivo = 0;
            var rendimento = 0.5;
            pesoVivo = element.pesoinicial;
            arroba = (pesoVivo * rendimento)/15;

            strTable += '<tr>';
            strTable += '<td>'+ element.numeroBrinco +'</td>';
            strTable += '<td>'+ categoria +'</td>';
            strTable += '<td>'+ element.sexo +'</td>';
            strTable += '<td>'+ element.pesoinicial +' kg / ' + arroba.toFixed(2) + ' @</td>';
            strTable += '<td>'+ idade +' </td>';
            strTable += '<td>'+ status +' </td>';

            if(element.status == true){
                strTable += '<td>';

                strTable += '<div class="divdica">';
                strTable += '<button class="btnopera" id="btn-edit"><img src="img/edit (1).svg" class="imgopera"> <span class="dica">Editar</span> </button>';
                strTable += '</div>';

                strTable += '&nbsp &nbsp';

                strTable += '<div class="divdica">';
                strTable += '<button class="btnopera" id="btnview"><img src="img/focus.svg" class="imgopera"> <span class="dica">Visualizar</span> </button>';
                strTable += '</div>';

                strTable += '</td>';
                strTable += '</tr>';
            } else {
                strTable += '<td>';

                strTable += '<div class="divdica">';
                strTable += '<button class="btnopera" id="btndelet"><img src="img/delete.svg" class="imgopera"> <span class="dica">Excluir</span> </button>';
                strTable += '</div>';

                strTable += '&nbsp &nbsp';

                strTable += '<div class="divdica">';
                strTable += '<button class="btnopera" id="btnview"><img src="img/focus.svg" class="imgopera"> <span class="dica">Visualizar</span> </button>';
                strTable += '</div>';

                strTable += '</td>';
                strTable += '</tr>';
            }
        });
        document.getElementById("data").innerHTML = strTable;
        //document.getElementById("qtdDesativado").innerHTML = qtdDesativo;
    }
});



/** -------------------------------------------------------------------------- */
/** ---------- Calcula diferenca em meses entre duas data (IDADE) ----------- */
function dateNascimento(dataNascido, dataAtual) {

    var intervalo = dataAtual - dataNascido;
    var dias = parseInt((dataAtual - intervalo) / (24 * 3600 * 100));

    var anoDataNascido = dataNascido.getFullYear();
    var anoDataHoje = dataAtual.getFullYear();
    var mesDataNascido = dataNascido.getMonth();
    var mesDataAtual = dataAtual.getMonth();

    var meses = (mesDataAtual + 12 * anoDataHoje) - (mesDataNascido + 12 * anoDataNascido);
    var anos = dataAtual.getFullYear() - dataNascido.getFullYear();

    //console.log("=> " + dias + " DIAS, => " + meses +"MESES => " + anos);

    return meses;
    
}



/** -------------------------------------------------------------------------- */
/** ----------- Busca na tabela por meio do codico do animal ------------- */
document.getElementById('buscarbtn').addEventListener('click', buscaFiltragem);

function buscaFiltragem(){
    var coluna = "0";
    var filtrar, tabela, tr, td, th, i;

    filtrar = document.getElementById("buscarcamp");
    filtrar = filtrar.value.toUpperCase();

    tabela = document.getElementById('tabelarebanho');
    tr = tabela.getElementsByTagName('tr');
    th = tabela.getElementsByTagName('th');
    
    for(i = 0; i < tr.length; i++){
        td = tr[i].getElementsByTagName('td')[coluna];

        if(td){
            if(td.innerHTML.toUpperCase().indexOf(filtrar) > -1){
                tr[i].style.display = ""; 
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}