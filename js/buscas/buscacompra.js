var url = "http://localhost:8080/compgado/todascompras";
fetch(url).then(res => res.json()).then(resJ => {
    console.log(resJ);

    if(resJ.length > 0){
        var strTable = "";
        var soma = 0;

        strTable += '<tr>';
        strTable += '<th>Identificador</th>';
        strTable += '<th>Data</th>';
        strTable += '<th>Valor da Compra</th>';
        strTable += '<th>Valor do Frete</th>';
        strTable += '<th>Fornecedor</th>';
        strTable += '<th>Anotações</th>';
        strTable += '<th>Operações</th>';
        strTable += '</tr>';

        resJ.forEach(element => {
            
            strTable += '<tr>';
            strTable += '<td>'+ element.idCompraGado +'</td>';
            strTable += '<td>'+ moment(element.dataDaCompra).format("DD/MM/YYYY") +'</td>';
            strTable += '<td> R$ '+ element.valorDaCompra.toFixed(2) +'</td>';
            strTable += '<td> R$ '+ element.valorDoFrete.toFixed(2) +'</td>';
            strTable += '<td>'+ element.fornecedor.nomeCompleto +'</td>';
            strTable += '<td width="200px">'+ element.anotacoes +'</td>';

            strTable += '<td>';
            strTable += '<div class="divdica">';
            strTable += '<button class="btnopera"><img src="img/edit (1).svg" class="imgopera"> <span class="dica">Editar</span> </button>';
            strTable += '</div>';
            strTable += '&nbsp &nbsp';

            strTable += '<div class="divdica">';
            strTable += '<button class="btnopera" id="btnview"><img src="img/focus.svg" class="imgopera"> <span class="dica">Visualizar</span> </button>';
            strTable += '</div>';

            strTable += '</tr>';
        });

        document.getElementById("dados-compra").innerHTML = strTable;
    }
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
            document.getElementById("compra-gado").innerHTML = strTable;
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
/*--------- Busca todos os parceirtos e preenche combobox ----------*/ 
var urlParc = "http://localhost:8080/parceiros/buscartodosparca";
fetch(urlParc).then(res => res.json()).then(resJ => {
    var strCombobox = "";
    strCombobox += '<option>Selecione...</option>';
    resJ.forEach(element => {
        strCombobox += '<option value="' + element.idParceiro + '">' + element.nomeCompleto + '</option>'
    });
    document.getElementById('fornecedor').innerHTML = strCombobox;
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
    
    filtrar = document.getElementById("buscarcamp");
    filtrar = filtrar.value.toUpperCase();

    tabela = document.getElementById('table-compra');
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