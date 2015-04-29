/////////////////////////////////////////////
// Modificações no componente TextAngular. //
/////////////////////////////////////////////

angular.module('app.widgets').config(Config);

function Config($provide, textAngularDialogProvider) {
    $provide.decorator('taOptions', ['$delegate', function(taOptions) {
        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'quote', 'p'],
            ['bold', 'italics', 'underline'],
            ['ul', 'ol'],
            ['undo', 'redo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight'],
            ['insertImage', 'insertLink', 'insertVideo'],
            ['html']
        ];
        taOptions.classes = {
            focussed: 'focussed',
            toolbar: 'btn-toolbar',
            toolbarGroup: 'btn-group',
            toolbarButton: 'btn btn-primary',
            toolbarButtonActive: 'active',
            disabled: 'disabled',
            textEditor: 'form-control',
            htmlEditor: 'form-control'
        };
        return taOptions;
    }]);
    $provide.decorator('taTranslations', ['$delegate', function(taTranslations) {
        taTranslations.heading.tooltip = 'Tamanho do texto ';
        taTranslations.p.tooltip = 'Parágrafo';
        taTranslations.ul.tooltip = 'Lista sem ordenação';
        taTranslations.ol.tooltip = 'Lista com ordenação';
        taTranslations.quote.tooltip = 'Citação';
        taTranslations.undo.tooltip = 'Desfazer';
        taTranslations.redo.tooltip = 'Refazer';
        taTranslations.bold.tooltip = 'Negrito';
        taTranslations.italic.tooltip = 'Itálico';
        taTranslations.underline.tooltip = 'Sublinhado';
        taTranslations.justifyLeft.tooltip = 'Alinhar texto a esquerda';
        taTranslations.justifyRight.tooltip = 'Alinhar texto a direita';
        taTranslations.justifyCenter.tooltip = 'Centralizar';
        taTranslations.clear.tooltip = 'Limpar formatação';
        taTranslations.insertImage = {
            dialogPrompt: 'Por favor digite a URL da imagem',
            tooltip: 'Inserir imagem'
        };
        taTranslations.insertVideo.tooltip = 'Inserir video';
        taTranslations.insertLink = {
            tooltip: 'Inserir / editar link',
            dialogPrompt: "Por favor entre com a URL"
        };
        taTranslations.html.tooltip = 'Mostrar HTML / Edições avançadas';
        return taTranslations;
    }]);
    $provide.decorator('taTools', ['$delegate', function(taTools) {
        taTools["h1"].buttontext = "T1";
        taTools["h2"].buttontext = "T2";
        taTools["h3"].buttontext = "T3";
        taTools["h4"].buttontext = "T4";
        delete taTools["bold"].iconclass;
        taTools["bold"].buttontext = "N";
        delete taTools["underline"].iconclass;
        taTools["underline"].buttontext = "S";
        taTools["insertImage"].action = function(deferred, restoreSelection) {
            var dialog = textAngularDialogProvider.$get()({mensagem: 'Por favor digite a URL da imagem.', url: 'http://'});
            var self = this;
            var selection = rangy.saveSelection(window);
            dialog.result.then(function(imageLink) {
                if (imageLink && imageLink !== '' && imageLink !== 'http://') {
                    rangy.restoreSelection(selection)
                    self.$editor().wrapSelection('insertImage', imageLink, true);
                    deferred.resolve();
                }
            });
            return false;
        };
        taTools["insertLink"].action = function(deferred, restoreSelection) {
            var dialog = textAngularDialogProvider.$get()({mensagem: 'Por favor digite a URL.', url: 'http://'});
            var self = this;
            var selection = rangy.saveSelection(window);
            dialog.result.then(function(urlLink) {
                if(urlLink && urlLink !== '' && urlLink !== 'http://') {
                    rangy.restoreSelection(selection)
                    self.$editor().wrapSelection('createLink', urlLink, true);
                    deferred.resolve();
                }
            });
            return false;
        };
        taTools["insertVideo"].action = function(deferred, restoreSelection) {
            var dialog = textAngularDialogProvider.$get()({mensagem: 'Por favor digite a URL do Youtube.', url: 'https://'});
            var self = this;
            var selection = rangy.saveSelection(window);
            dialog.result.then(function(urlPrompt) {
                if (urlPrompt && urlPrompt !== '' && urlPrompt !== 'https://') {
                    var ids = urlPrompt.match(/(\?|&)v=[^&]*/);
                    if (ids && ids.length > 0) {
                        var urlLink = "https://www.youtube.com/embed/" + ids[0].substring(3);
                        var embed = '<img class="ta-insert-video" src="https://img.youtube.com/vi/' + ids[0].substring(3) + '/hqdefault.jpg" ta-insert-video="' + urlLink + '" contenteditable="false" src="" allowfullscreen="true" frameborder="0" />';
                        rangy.restoreSelection(selection)
                        self.$editor().wrapSelection('insertHTML', embed, true);
                        deferred.resolve();
                    }
                }
            });
            return false;
        };
        return taTools;
    }]);
}
