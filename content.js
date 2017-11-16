function modInstr() {
    var popElement = '<a data-placement="bottom" data-toggle="popover" data-content="" data-trigger="focus" html="true" data-placement="right" title="Professor Rating" href=""></a>';
    var urlClass = 'PSHYPERLINK';
    $('[id^="DERIVED_CLS_DTL_SSR_INSTR_LONG"], [id^="MTG_INSTR"], [id^="MTGPAT_INSTR"]').each(function() {
        if ($(this).text().trim() == "Staff") return;

        if ($(this).html().indexOf("<br>") > -1) {
            var profs = $(this).html().split("<br>");
            var spanWrap = "";
            for (var i = 0; i < profs.length; i++) {
                spanWrap += "<span class='INSTR_INSERT_ID'>" + profs[i] + "</span><br>";
            }
            $(this).html(spanWrap);
        } else {
            $(this).addClass(urlClass);
            $(this).wrap(popElement);
        }

        $(this).parent().click(function(event) {
            event.preventDefault();
            var pop = $(this);
            setContent(pop);
        });
    });


    $('.INSTR_INSERT_ID').each(function() {
        if ($(this).text().trim() == "Staff") {
            $(this).attr("class", "INSTR_INSERT_ID");
            return;
        }

        $(this).addClass(urlClass);
        $(this).wrap(popElement);

        $(this).parent().click(function(event) {
            event.preventDefault();
            var pop = $(this);
            setContent(pop);
        });
    });

    $(function() {
        $('[data-toggle=popover]').popover({
            html: true
        })
    })


    $('[data-toggle=popover').each(function() {
        $(this).attr('data-content', '<div>Retreiving ratings...</div>');
    });
}

function setContent(pop) {
    if (pop.attr('data-content') == "" || pop.attr('data-content') == '<div>Retreiving ratings...</div>') {
        pop.attr('data-content', '<div>Retreiving ratings...</div>');
        chrome.runtime.sendMessage({ type: 'search', professor: pop.children().first().text().trim() }, function(response) {
            if (response.link == "") {
                pop.attr('data-content', '<div>Rating not found.</div>');
            } else pop.attr('data-content', '<div>Rating for: ' + pop.children().first().text().trim() + '</div><div><br>Overall Quality: <strong>' + response.quality + ' / 5.0</strong><br>Would Take Again: <strong>' +
                response.takeAgain + '</strong><br>Level of Difficulty: <strong>' + response.difficulty + ' / 5.0</strong></div><div><br><a href="' + response.link + '" target="_blank">View on RateMyProfessor</a></div>');
            pop.popover('show');
        });
    }
}

window.onload = function() {
    var target = document.getElementById('pt_pageinfo_win0');
    var observer = new MutationObserver(function(mutations) {
        if (mutations[0] != null && mutations[0]) {
            $('[data-toggle=popover').each(function() {
                $(this).popover('hide');
            });
            modInstr();
        }
    });
    var config = { attributes: true };
    observer.observe(target, config);

    modInstr();
};

if (window.location.href.indexOf("uocampus.uottawa.ca") > -1) {
    chrome.runtime.sendMessage({ type: 'showPageAction' });
}