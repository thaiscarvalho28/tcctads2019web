var url = "http://localhost:8080/manejosanidade/todosmanejos";

fetch(url).then(res => res.json()).then(resJ => {
    document.getElementById('manejo').innerHTML = resJ.length;
    console.log(resJ);

    if(resJ.length > 0){
        var strTable = "";
        var soma = 0;
        var custoInsumo = 0;

        strTable += '<tr>';
        strTable += '<th>Identificador</th>';
        strTable += '<th>Data do Manejo</th>';
        strTable += '<th>Data do Próximo</th>';
        strTable += '<th>Lote Manejado</th>';
        strTable += '<th>Tratamento</th>';
        strTable += '<th>Custos Totais</th>';
        strTable += '<th>Operações</th>';
        strTable += '</tr>';

        resJ.forEach(element => {

            custoInsumo = element.custoUnitarioInsumo * element.quantInsumo;
            soma = custoInsumo + element.custosAdicionais;

            strTable += '<tr>';
            strTable += '<td>'+ element.idManejo +'</td>';
            strTable += '<td>'+ moment(element.dataManejo).format("DD/MM/YYYY") +'</td>';
            strTable += '<td>'+ moment(element.dataProximo).format("DD/MM/YYYY") +'</td>';
            strTable += '<td>'+ element.lote.codigoLote +'</td>';
            strTable += '<td width="180px">'+ element.tratamento +'</td>';

            strTable += '<td>R$ '+ parseFloat(soma.toFixed(2)) +'</td>';

            strTable += '<td>';
            strTable += '<div class="divdica">';
            strTable += '<button class="btnopera"><img src="img/edit (1).svg" class="imgopera"> <span class="dica">Editar</span> </button>';
            strTable += '</div>';
            strTable += '&nbsp &nbsp';

            strTable += '<div class="divdica">';
            strTable += '<button class="btnopera" id="btnview"><img src="img/focus.svg" class="imgopera"> <span class="dica">Visualizar</span> </button>';
            strTable += '</div>';
            strTable += '&nbsp &nbsp';
            
            strTable += '<div class="divdica">';
            strTable += '<button class="btnopera"><img src="img/delete.svg" class="imgopera"> <span class="dica">Desativar</span> </button>';
            strTable += '</div>';
            strTable += '</td>';

            strTable += '</tr>';
        });

        document.getElementById("data").innerHTML = strTable;
    }
});


/** ------------------------------------------------------------------- */
/*------------ Busca todos os lotes e preenche combobox ------------*/ 
var urlLote = "http://localhost:8080/lotes/listalotes";
fetch(urlLote).then(res => res.json()).then(resJ => {
    var strCombobox = "";
    strCombobox += '<option>Selecione...</option>';
    resJ.forEach(element => {
        strCombobox += '<option value="' + element.id + '">' + element.codigoLote + '</option>'
    });
    document.getElementById('combo-idlotes').innerHTML = strCombobox;
});



/** ------------------------------------------------------------------- */
/*------------ ADICIONA O GADO DO LOTE SELECIONADO NA TABELA ------------*/ 
function addAllGado(){
    var urlAll = "http://localhost:8080/lotes/listalotes";
    var loteSelect = document.getElementById("combo-idlotes").value;
    
    fetch(urlAll).then(res => res.json()).then(resJ => {       
        if(resJ.length > 0){
            var strTable = "";
            resJ.forEach(element => {
                if(element.id == loteSelect){
                    element.gado_bovino.forEach(gado => {
                        strTable += '<tr>';
                        strTable += '<td id="num-brinco">'+ gado.numeroBrinco + '</td>';
                        strTable += '<td> <button type="button" onclick="remove(this)" class="btn-remove remove-linha">Excluir</button> </td>';
                        strTable += '</tr>';
                    });
                }
            });
            document.getElementById("tbadd-novo").innerHTML = strTable;
        }

    });
}


/**
 * --------------------------------------------------------------- */
/** ---- REMOVE A LINHA DE UMA TABELA (CLICK NO BOTAO) */
(function($) {
    remove = function(item) { 
      var tr = $(item).closest('tr');
      tr.fadeOut(400, function() {
        tr.remove();  
      });
      return false;
    }
})(jQuery);


/**
 * -------------------------------------------------------------------- */
/*------------ Impede o button de atualizar a pagina ------------*/
$(document).ready(function($) {
    $(document).on('submit', '#form-cad-manejo', function(event) {
      event.preventDefault();
    });
});


/** -------------------------------------------------------------------------- */
/** ----------- Busca na tabela por meio da data ------------- */
$(document).ready(function(){
    $("#buscarcamp").mask("00/0000");
});

document.getElementById('buscarbtn').addEventListener('click', buscaFiltragem);

function buscaFiltragem(){
    var coluna = "1";
    var filtrar, tabela, tr, td, th, i;
    var result;

    filtrar = document.getElementById("buscarcamp");
    filtrar = filtrar.value.toUpperCase();

    tabela = document.getElementById('tabelamain');
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

/*------------ Botao que da refresh na pagina ------------*/
function refresh(){
    window.location.reload();
}
/*--------------------------------------------------------------------- */
