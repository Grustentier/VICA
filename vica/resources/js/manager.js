/**
Dirty vanilla JS scripting by Grustentier using jQuery JavaScript Library v3.6.0 and Bootstrap v5.3.2 (https://getbootstrap.com/)
version 1.0.0
*/

let humanGenomeVersion = "hg19";
let chromosome = "";
let start = "";
let end = "";
let ref = "";
let alt = "";
let gene = "";
let mobiDetailsId = "";
let validInputs = [];

/*
const externalTools = {
	"mobiDetails": "resources/imgs/mobiDetails.png",
    "genomAD":"resources/imgs/gnomAD.png",
    "clinvar":"resources/imgs/ncbi_clinvar.png",
    "ensembl":"resources/imgs/ensembl.png",
    "ucsc":"resources/imgs/ucsc.png",
    "varsome":"resources/imgs/varsome.png",
    "spliceAI_lookup":"resources/imgs/spliceAI_lookup.png",
    "spCards":"resources/imgs/spCards.png",
    "dgv":"resources/imgs/dgv.png",
    "decipher":"resources/imgs/decipher.png",
    "franklin":"resources/imgs/franklin.png",
    "mutation_tasting":"resources/imgs/mutation_tasting.png",
    "mistic":"resources/imgs/mistic.png",
    "primAD":"resources/imgs/primAD.png",
    "lovd":"resources/imgs/lovd.png"    
};
*/ 

const externalTools = {
	"mobiDetails":"mobiDetails",
    "genomAD":"genomAD",
    "clinvar":"ClinVar",
    "ensembl":"e!Ensembl",
    "ucsc":"UCSC Genome Browser",
    "varsome":"varsome",
    "spliceAI_lookup":"SpliceAI-lookup",
    "spCards":"SPCards",
    "dgv":"Database of Genomic Variants",
    "decipher":"Decipher",
    "franklin":"Franklin",
    "mutation_tasting":"mutation t@sting",
    "mistic":"MISTIC",
    "primAD":"primAD",
    "lovd":"LOVD"    
};

const toolDescription = {
	"mobiDetails":"mobiDetailsId",
    "genomAD":"for variant: Chr + Pos + Ref + Alt OR for region: Chr + Start + End OR for gene: Gene",
    "clinvar":"Chr + Start + End",
    "ensembl":"Chr + Start + End",
    "ucsc":"Chr + Start + End",
    "varsome":"Chr + Pos + Ref + Alt",
    "spliceAI_lookup":"Chr + Pos + Alt + Ref",
    "spCards":"Chr + Pos + Ref + Alt",
    "dgv":"Chr + Start + End",
    "decipher":"Chr + Start + End OR Chr + Start + End + Gene",
    "franklin":"Chr + Pos + Ref + Alt OR Chr + Start + End OR Gene",
    "mutation_tasting":"Chr + Pos + Ref + Alt",
    "mistic":"Chr + Pos + Ref + Alt",
    "primAD":"Gene",
    "lovd":"Gene"
};

const toolParameterSets = {
	"mobiDetails": ["mobiDetailsId"],
	"genomAD": ["chr-pos-ref-alt", "chr-start-end", "gene"],
	"clinvar": ["chr-start-end"],
	"ensembl": ["chr-start-end"],
	"ucsc": ["chr-start-end"],
	"varsome": ["chr-pos-ref-alt"],
	"spliceAI_lookup": ["chr-pos-ref-alt"],
	"spCards": ["chr-pos-ref-alt"],
	"dgv": ["chr-start-end"],
	"decipher": ["chr-start-end", "chr-gene-start-end"],
	"franklin": ["chr-pos-ref-alt", "chr-start-end", "gene"],
	"mutation_tasting": ["chr-pos-ref-alt"],
	"mistic": ["chr-pos-ref-alt"],
	"primAD": ["gene"],
	"lovd": ["gene"]
};

const parameterColors = {
	chr: "#fd7e14",
	gene: "#20c997",
	start: "#6f42c1",
	pos: "#6f42c1",
	end: "#0d6efd",
	ref: "#198754",
	alt: "#d63384",
	mobiDetailsId: "#ffc107"
}

let isSubset = (array1, array2) => array2.every((element) => array1.includes(element));

/**
 * Returns an jQuery object which represents included skeleton progressor HTML  
 */
let createSkeletonProgressor = () => {
	return $(`<div class="skeleton-progressor">
				<div class="skeleton-progressor-shimmer">
        			<div class="_2iwr container-fluidX"></div>
        			<div class="_2iws container-fluidX"></div>
        			<div class="_2iwt container-fluidX"></div>
        			<div class="_2iwu container-fluidX"></div>
        			<div class="_2iwv container-fluidX"></div>
        			<div class="_2iww container-fluidX"></div>
        			<div class="_2iwx container-fluidX"></div>
        			<div class="_2iwy container-fluidX"></div>
        			<div class="_2iwz container-fluidX"></div>
        			<div class="_2iw- container-fluidX"></div>
        			<div class="_2iw_ container-fluidX"></div>
        			<div class="_2ix0 container-fluidX"></div>
      			</div>
      		  </div>
      		`);
}

/**
 * Appends a skeleton progressor to an HTML element
 */
let appendSkeletonProgressor = (entity) => {
	if (typeof entity === "string") {
		$('#' + entity).children().addClass('d-none');
		$('#' + entity).append(createSkeletonProgressor());
	}

	if (typeof entity === "object") {
		$(entity).children().addClass('d-none');
		$(entity).append(createSkeletonProgressor());
	}
}

/**
 * Removes a skeleton progressor from an HTML element
 */
let removeSkeletonProgressor = (entity) => {
	if (typeof entity === "string") {
		$('#' + entity + ' .skeleton-progressor').remove();
		$('#' + entity).children().removeClass('d-none');
	}

	if (typeof entity === "object") {
		$(entity).find('.skeleton-progressor').remove();
		$(entity).children().removeClass('d-none');
	}
}

/**
 * Resetting the modal included iframe for next call.
 */
let resetIFrame = () => {
	$("#external-tools-modal .modal-body iframe").removeAttr("srcdoc");
	$("#external-tools-modal .modal-body iframe").attr("src", "resources/html/table-skeleton-loader.html");
}

/**
 * Assigns the given url to modal included iframe and finally opens the bootstrap modal.
 */
let openInModal = (url) => {
	$("#external-tools-modal .modal-body iframe").attr("src", encodeURI(url))
	var modal = bootstrap.Modal.getOrCreateInstance($("#external-tools-modal"));
	modal.show();
}

/**
 * Opens an new browser tab window with name 'external-tool-tab'.
 */
let openInNewTab = (url) => {
	window.open(encodeURI(url), 'external-tool-tab');
}

/**
 * Opens the assigned app url in bootstrap modal (opener == 'modal') or browser tab (opener != 'modal' or #open-in-toggle is checked).
 */
let openApp = (url, opener = "modal") => {
	if ($("#open-in-toggle").is(':checked')) {
		openInNewTab(url);
		return true;
	}

	if (opener == "modal") {
		openInModal(url)
	} else {
		openInNewTab(url);
	}
}

/**
 * Visual highlighting of .data-input elements by changing border color.
 */
let highlightInput = (ariaLabel) => {
	$("input[aria-label='" + ariaLabel + "']").css('border', '3px solid red');
	setTimeout(function() {
		$("input[aria-label='" + ariaLabel + "']").css('border', '1px solid #dee2e6');
	}, 3000);
}

/**
 * Checks the value lengths of the .data-input elements. If the length of a given value is greater 0 the corresponding input will be registered as valid.
 * This step is necessary to further check which parameters can be used to call an external app.
 */
let registerValidInputData = () => {
	if (chromosome.length > 0) {
		if (jQuery.inArray("chr", validInputs) == -1) {
			validInputs.push("chr");
		}
	} else {
		validInputs = validInputs.filter(function(elem) {
			return elem != "chr";
		});
	}

	if (!$("#use-chr-input").is(":checked")) {
		chromosome = "";
		validInputs = validInputs.filter(function(elem) {
			return elem != "chr";
		});
	}

	if (start.length > 0) {
		if (jQuery.inArray("start", validInputs) == -1) {
			validInputs.push("start");
		}

		if (jQuery.inArray("pos", validInputs) == -1) {
			validInputs.push("pos");
		}
	} else {
		validInputs = validInputs.filter(function(elem) {
			return elem != "start" && elem != "pos";
		});
	}

	if (!$("#use-start-input").is(":checked")) {
		start = "";
		validInputs = validInputs.filter(function(elem) {
			return elem != "start" && elem != "pos";
		});
	}


	if (end.length > 0) {
		if (jQuery.inArray("end", validInputs) == -1) {
			validInputs.push("end");
		}
	} else {
		validInputs = validInputs.filter(function(elem) {
			return elem != "end";
		});
	}

	if (!$("#use-end-input").is(":checked")) {
		end = "";
		validInputs = validInputs.filter(function(elem) {
			return elem != "end";
		});
	}

	if (ref.length > 0) {
		if (jQuery.inArray("ref", validInputs) == -1) {
			validInputs.push("ref");
		}
	} else {
		validInputs = validInputs.filter(function(elem) {
			return elem != "ref";
		});
	}

	if (!$("#use-ref-input").is(":checked")) {
		ref = "";
		validInputs = validInputs.filter(function(elem) {
			return elem != "ref";
		});
	}

	if (alt.length > 0) {
		if (jQuery.inArray("alt", validInputs) == -1) {
			validInputs.push("alt");
		}
	} else {
		validInputs = validInputs.filter(function(elem) {
			return elem != "alt";
		});
	}

	if (!$("#use-alt-input").is(":checked")) {
		alt = "";
		validInputs = validInputs.filter(function(elem) {
			return elem != "alt";
		});
	}

	if (gene.length > 0) {
		if (jQuery.inArray("gene", validInputs) == -1) {
			validInputs.push("gene");
		}
	} else {
		validInputs = validInputs.filter(function(elem) {
			return elem != "gene";
		});
	}


	if (!$("#use-gene-input").is(":checked")) {
		gene = "";
		validInputs = validInputs.filter(function(elem) {
			return elem != "gene";
		});
	}
	
	if (mobiDetailsId.length > 0) {
		if (jQuery.inArray("mobiDetailsId", validInputs) == -1) {
			validInputs.push("mobiDetailsId");
		}
	} else {
		validInputs = validInputs.filter(function(elem) {
			return elem != "mobiDetailsId";
		});
	}

	if (!$("#use-mobiDetailsId-input").is(":checked")) {
		mobiDetailsId = "";
		validInputs = validInputs.filter(function(elem) {
			return elem != "mobiDetailsId";
		});
	}
}

/**
 * Sets the max possible parameter set to a .tool-card element and toggles the card activation.
 */
let activateToolCardOnValidInputRequirements = () => {

	registerValidInputData();

	$("#external-tools-container .used-requirements").html("");

	$.each($("#external-tools-container .tool-card"), function(_, element) {
		var relevantParameterSets = [];
		const parameterSet = toolParameterSets[$(element).attr("tool")];
		const toolCard = element;

		//Finds relevant parameter sets if valid data from .data-input elements are subset of current tool parameter set.
		$.each(parameterSet, function(_, requirements) {
			const reqSplit = requirements.split("-");
			if (isSubset(validInputs, reqSplit)) {
				relevantParameterSets.push(reqSplit);
			}
		});

		if (relevantParameterSets.length > 0) {
			//Find the longest (fine-grained) parameter set
			let longestParameterSet = relevantParameterSets.reduce((a, b) => a.length > b.length ? a : b);

			var coloredParameter = "";
			$.each(longestParameterSet, function(_, req) {
				coloredParameter += `<span class="p-1 ms-1 rounded" style="font-size: 12px;color:#fff;background:${parameterColors[req]}">${req}</span>`;
			})
			$(toolCard).prev(".used-requirements").html(coloredParameter);
			$(toolCard).removeClass("disabled");
		} else {
			$(toolCard).addClass("disabled");
		}

	});
}

/**
 * On triggering keyup event of a .data-input element, the corresponding value will be assigned to its variable.
 */
let gatherInputData = (dataInputElement) => {
	let value = "";

	if ($(dataInputElement).attr("validationType") == "number") {
		value = dataInputElement.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
	}

	if ($(dataInputElement).attr("validationType") == "base") {
		value = dataInputElement.value.replace(/[^ACGTacgt.]/g, '').replace(/(\..*)\./g, '$1').toUpperCase();
	}

	if ($(dataInputElement).attr("validationType") == "text") {
		value = dataInputElement.value.replace(/[^a-zA-Z0-9.]/g, '').replace(/(\..*)\./g, '$1').toUpperCase();
	}

	if ($(dataInputElement).attr("aria-label") == "Chromosome") {
		chromosome = value;
	}

	if ($(dataInputElement).attr("aria-label") == "Start") {
		start = value;
	}

	if ($(dataInputElement).attr("aria-label") == "End") {
		end = value;
	}

	if ($(dataInputElement).attr("aria-label") == "Ref") {
		ref = value;
	}

	if ($(dataInputElement).attr("aria-label") == "Alt") {
		alt = value;
	}

	if ($(dataInputElement).attr("aria-label") == "Gene") {
		gene = value;
	}
	
	if ($(dataInputElement).attr("aria-label") == "mobiDetailsId") {
		mobiDetailsId = value;
	}
}

let showError = (txt) => {
	$("#error-notification-alert .content").html(txt);
	$("#error-notification-alert").addClass("show");
	setTimeout(() => {
		$("#error-notification-alert").removeClass("show");
		$("#error-notification-alert .content").html("");
	}, 3000)
}

/**
 * HTML tool card generation based on information from externalTools object
 */
let renderToolCards = () => {
	$.each(Object.keys(externalTools),function(_,tool){
		//with images... 
		//change externalTools object with image paths
		//images not included
		/*$("#external-tools-container").append(`
				<div class="tool-card-container m-4">
					<div class="w-100 used-requirements" style="margin-top:-37px;height:20px;"></div>
					<div class="tool-card shadow p-2 rounded disabled" style="background:url('${externalTools[tool]}'); background-size: contain;background-repeat: no-repeat;background-position: center;background-origin: content-box;" tool="${tool}" alt="${toolDescription[tool]}" title="${toolDescription[tool]}">

					</div>
				</div>
											`);*/
		$("#external-tools-container").append(`
				<div class="tool-card-container m-4">
					<div class="w-100 used-requirements" style="margin-top:-37px;height:20px;"></div>				
					<div class="tool-card shadow p-2 rounded text-primary disabled" style="display: inline-grid; justify-content: center; align-items: center;font-size: 40px;text-align:center" tool="${tool}" alt="${toolDescription[tool]}" title="${toolDescription[tool]}">
						${externalTools[tool]}
					</div>
				</div>
											`);
	});
}

let createMobiDetailsVariant = (hgvs, callback) => {
	var apiKey = $("#mobidetails-api-key-input").val();

	hgvs = hgvs.replaceAll(":", "%3A");
	hgvs = hgvs.replaceAll(">", "%3E");
	hgvs = hgvs.replaceAll("+", "%2B");
	hgvs = hgvs.replaceAll("-", "%2D");

	ServiceCaller.get("https://mobidetails.iurc.montp.inserm.fr/MD/api/variant/create?variant_chgvs=" + encodeURI(hgvs) + "&caller=cli&api_key=" + apiKey + "", { "H": "accept:application/json" }, function(response) {
		if (callback) {

			if (response.mobidetails_error) {
				showError(response.mobidetails_error);
			}

			callback(response);
		}
	});
}

let transferMobiDetailsInfoToInputFields = (mobiDetailsId) => {
	$("#mobiDetailsId-input").val(mobiDetailsId);

	ServiceCaller.get("https://mobidetails.iurc.montp.inserm.fr/MD/api/variant/" + mobiDetailsId + "/cli/,", {}, function(r2) {
		if (r2.VCF) {
			$("#chr-input").val(r2.VCF.chr);
			$("#ref-input").val(r2.VCF[humanGenomeVersion].ref);
			$("#alt-input").val(r2.VCF[humanGenomeVersion].alt);
			$("#start-input").val(r2.VCF[humanGenomeVersion].pos);

			if (r2.VCF[humanGenomeVersion].ref.length > r2.VCF[humanGenomeVersion].alt.length) {
				const diff = r2.VCF[humanGenomeVersion].ref.length - r2.VCF[humanGenomeVersion].alt.length;
				$("#end-input").val(r2.VCF[humanGenomeVersion].pos + diff);
			} else {
				$("#end-input").val(r2.VCF[humanGenomeVersion].pos);
			}
		}

		if (r2.gene) {
			$("#gene-input").val(r2.gene.symbol);
		}

		$(".data-input").keyup();
		removeSkeletonProgressor($("#input-data-row"));
	});
}

let fillInputFieldsByMobiDetailsData = () => {
	if ($("#mobidetails-hgvs-input").val().trim().length == 0) {
		showError("Please insert a valid HGVS genomic variant description!");
		return;
	}

	appendSkeletonProgressor($("#input-data-row"));

	ServiceCaller.get("https://mobidetails.iurc.montp.inserm.fr/MD/api/variant/exists/" + $("#mobidetails-hgvs-input").val(), {}, function(r1) {
		if (r1.mobidetails_id) {
			transferMobiDetailsInfoToInputFields(r1.mobidetails_id);
		} else {
			createMobiDetailsVariant($("#mobidetails-hgvs-input").val(), function(response) {
				if (response.mobidetails_id) {
					transferMobiDetailsInfoToInputFields(response.mobidetails_id);
				} else {
					$("#chr-input").val("");
					$("#ref-input").val("");
					$("#alt-input").val("");
					$("#start-input").val("");
					$("#end-input").val("");
					$("#gene-input").val("");
					$("#mobiDetailsId-input").val("");
					$(".data-input").keyup();
					removeSkeletonProgressor($("#input-data-row"));
				}
			});
		}
	});

}

$(document).ready(function() {
	
	renderToolCards();
	
	if ($.cookie("mobidetails-api-key")) {
		$("#mobidetails-api-key-input").val($.cookie("mobidetails-api-key"));
	}

	$("#mobidetails-hgvs-input").on("keyup", function() {
		fillInputFieldsByMobiDetailsData();
	});

	$("#mobidetails-hgvs-search-btn").click(function() {
		fillInputFieldsByMobiDetailsData();
	});
	 
	
	
	$(".use-input").click(function(_) {
		$(this).parent().prev().keyup();
	});

	$("input[name='hg']").change(function() {
		humanGenomeVersion = $(this).val();
	});

	$(".data-input").on("keyup", function() {
		gatherInputData(this);
		activateToolCardOnValidInputRequirements();
	});

	$("#external-tools-container .tool-card").click(function() {

		if ($(this).hasClass("disabled")) {
			return;
		}

		$("input").css('border', '1px solid #dee2e6');

		resetIFrame();

		setTimeout(() => {
			if ($(this).attr("tool") == "primAD") {

				if (gene.length > 0) {
					openApp("https://primad.basespace.illumina.com/gene/" + gene + "?dataset=gnomad_r3", "modal");
					return;
				}

				highlightInput('Gene');


			} else if ($(this).attr("tool") == "genomAD") {

				var dataset = "gnomad_r2_1";

				if (humanGenomeVersion == "hg38") {
					dataset = "gnomad_r4";
				}

				if (chromosome.length > 0 && start.length > 0 && ref.length > 0 && alt.length > 0) {
					openApp("https://gnomad.broadinstitute.org/variant/" + chromosome + "-" + start + "-" + ref + "-" + alt + "?dataset=" + dataset, "modal");
					return;
				}

				if (chromosome.length > 0 && start.length > 0 && end.length > 0) {
					openApp("https://gnomad.broadinstitute.org/region/" + chromosome + "-" + start + "-" + end + "?dataset=" + dataset, "modal");
					return;
				}

				if (gene.length > 0) {
					openApp("https://gnomad.broadinstitute.org/gene/" + gene + "?dataset=" + dataset, "modal");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('End');
				highlightInput('Ref');
				highlightInput('Alt');
				highlightInput('Gene');


			} else if ($(this).attr("tool") == "varsome") {

				if (chromosome.length > 0 && start.length > 0 && ref.length > 0 && alt.length > 0) {
					openApp("https://varsome.com/variant/" + humanGenomeVersion + "/" + chromosome + " " + start + " " + ref + " " + alt + "?annotation-mode=germline", "tab");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('Ref');
				highlightInput('Alt');

			} else if ($(this).attr("tool") == "clinvar") {

				if (chromosome.length > 0 && start.length > 0 && end.length > 0) {
					openApp("https://www.ncbi.nlm.nih.gov/clinvar/?term=" + chromosome + ":" + start + "-" + end + "", "modal");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('End');

			} else if ($(this).attr("tool") == "ensembl") {

				if (chromosome.length > 0 && start.length > 0 && end.length > 0) {
					openApp("https://grch37.ensembl.org/Homo_sapiens/Location/View?r=" + chromosome + ":" + start + "-" + end + "", "tab");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('End');

			} else if ($(this).attr("tool") == "ucsc") {

				if (chromosome.length > 0 && start.length > 0 && end.length > 0) {
					openApp("https://genome.ucsc.edu/cgi-bin/hgTracks?db=" + humanGenomeVersion + "&position=" + chromosome + ":" + start + "-" + end + "", "modal");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('End');

			} else if ($(this).attr("tool") == "spliceAI_lookup") {

				if (chromosome.length > 0 && start.length > 0 && ref.length > 0 && alt.length > 0) {
					openApp("https://spliceailookup.broadinstitute.org/#variant=" + chromosome + "-" + start + "-" + ref + "-" + alt + "&hg=" + ((humanGenomeVersion == "hg19") ? "37" : "38") + "&distance=500&mask=0&ra=0", "modal");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('Ref');
				highlightInput('Alt');

			} else if ($(this).attr("tool") == "spCards") {

				if (chromosome.length > 0 && start.length > 0 && ref.length > 0 && alt.length > 0) {
					openApp("http://www.genemed.tech/spcards/search?inputValue=" + chromosome + ":" + start + ":" + ref + ":" + alt + "&searchType=genomicCoordinate&reference=" + humanGenomeVersion, "modal");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('Ref');
				highlightInput('Alt');

			} else if ($(this).attr("tool") == "dgv") {

				if (chromosome.length > 0 && start.length > 0 && end.length > 0) {
					openApp("http://dgv.tcag.ca/gb2/gbrowse/dgv2_" + humanGenomeVersion + "/?name=" + chromosome + ":" + start + "-" + end + ";search=Search", "modal");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('End');

			} else if ($(this).attr("tool") == "decipher") {

				if (chromosome.length > 0 && start.length > 0 && end.length > 0 && gene.length > 0) {
					openApp("https://www.deciphergenomics.org/browser#q/" + gene + "/location/" + chromosome.replace("chr", "") + ":" + start + "-" + end, "tab");
					return;
				}

				if (chromosome.length > 0 && start.length > 0 && end.length > 0) {
					if (humanGenomeVersion == "hg19") {
						openApp("https://www.deciphergenomics.org/browser#q/grch37:" + chromosome.replace("chr", "") + ":" + start + "-" + end, "tab");
						return;
					}

					if (humanGenomeVersion == "hg38") {
						openApp("https://www.deciphergenomics.org/browser#q/" + chromosome.replace("chr", "") + ":" + start + "-" + end, "tab");
						return;
					}
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('End');
				highlightInput('Gene');

			} else if ($(this).attr("tool") == "franklin") {

				if (chromosome.length > 0 && start.length > 0 && ref.length > 0 && alt.length > 0) {
					openApp("https://franklin.genoox.com/clinical-db/variant/snp/" + chromosome + "-" + start + "-" + ref + "-" + alt + "-" + humanGenomeVersion, "tab");
					return;
				}

				if (chromosome.length > 0 && start.length > 0 && end.length > 0) {
					window.open(encodeURI("https://franklin.genoox.com/clinical-db/variant/roh/" + chromosome + "-" + start + "-" + end), 'franklin-roh');
					window.open(encodeURI("https://franklin.genoox.com/clinical-db/variant/sv/" + chromosome + "-" + start + "-" + end + "-DUP-" + humanGenomeVersion), 'franklin-dup');
					window.open(encodeURI("https://franklin.genoox.com/clinical-db/variant/sv/" + chromosome + "-" + start + "-" + end + "-DEL-" + humanGenomeVersion), 'franklin-del');
				}

				if (gene.length > 0) {
					openApp("https://franklin.genoox.com/clinical-db/gene/" + humanGenomeVersion + "/" + gene, "tab");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('Ref');
				highlightInput('Alt');
				highlightInput('Gene');

			} else if ($(this).attr("tool") == "mutation_tasting") {

				if (chromosome.length > 0 && start.length > 0 && ref.length > 0 && alt.length > 0) {
					openApp("https://www.genecascade.org/MTc2021/ChrPos102.cgi?hgvs_notation=" + chromosome + ":" + start + "" + ref + ">" + alt, "tab");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('Ref');
				highlightInput('Alt');

			} else if ($(this).attr("tool") == "mistic") {

				if (chromosome.length > 0 && start.length > 0 && ref.length > 0 && alt.length > 0) {
					openApp("https://lbgi.fr/api/mistic/score/GRCh37/" + chromosome.replace("chr", "") + "/" + start + "/" + ref + "/" + alt + "", "modal");
					return;
				}

				highlightInput('Chromosome');
				highlightInput('Start');
				highlightInput('Ref');
				highlightInput('Alt');

			} else if ($(this).attr("tool") == "mobiDetails") {

				if (mobiDetailsId.length > 0) {
					openApp("https://mobidetails.iurc.montp.inserm.fr/MD/api/variant/" + mobiDetailsId + "/browser/", "tab");
					return;
				}

				highlightInput('mobiDetailsId');

			}else if ($(this).attr("tool") == "lovd") {
				if (gene.length > 0) {
					openApp("https://databases.lovd.nl/shared/genes/" + gene, "modal");
					return;
				}

				highlightInput('Gene');

			} else {
				$("#external-tools-modal .modal-body iframe").attr("src", "/fileNotFound")
			}
		}, 200);

	});
});