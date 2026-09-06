/* =========================================================
   CASE FILES #001
   THE MISSING STUDENT
   FINAL CLEAN SCRIPT
   =========================================================

   FEATURES
   01. Evidence Board
   02. Alibi System
   03. Contradiction System
   04. Deduction
   05. Final Accusation
   06. Branching Interrogation
   07. Suspect Reactions
   08. Changed Statements
   09. Case Journal
   10. Detective Reputation
   11. Multiple Endings
   12. Secret Evidence
   13. Secret Suspect / hidden truth
   14. Hidden Connections
   15. Red Herring
   16. Location Investigation
   17. Object Search
   18. Evidence Inspection
   19. Interactive Timeline
   20. Reconstruction
   ========================================================= */


/* =========================================================
   BASIC HELPERS
   ========================================================= */

const $ = id => document.getElementById(id);

const esc = value => {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
};


/* =========================================================
   GAME STATE
   ========================================================= */

const game = {

    currentScreen: "mainMenu",

    investigationStarted: false,

    score: 0,

    reputation: 0,

    evidenceFound: [],

    visitedLocations: [],

    investigatedObjects: [],

    interviewedSuspects: [],

    contradictionsFound: [],

    changedStatements: [],

    hiddenConnections: [],

    discoveredSecrets: [],

    achievements: [],

    selectedBoardEvidence: [],

    timelineOrder: [],

    deductionA: null,
    deductionB: null,

    currentLocation: null,
    currentEvidence: null,
    currentSuspect: null,

    interrogationStep: 0,

    accusationAttempts: 0,

    caseSolved: false,

    finalEnding: null,

    journal: {
        suspects: [],
        evidence: [],
        conclusions: [],
        questions: []
    }

};


/* =========================================================
   CASE DATA
   ========================================================= */

const CASE_DATA = {

    id: "001",

    title: "THE MISSING STUDENT",

    victim: {
        name: "Evan Carter",
        age: 17
    },


    /* =====================================================
       LOCATIONS
       ===================================================== */

    locations: {

        school: {
            name: "Sekolah",
            icon: "🏫",
            description:
                "Gedung utama sekolah. Beberapa kamera masih aktif setelah jam sekolah.",

            objects: [

                {
                    id: "school_camera",
                    name: "Kamera Koridor",
                    icon: "📹",
                    evidence: "camera_log",
                    description:
                        "Rekaman memperlihatkan Evan berjalan menuju sayap timur pada pukul 18:21."
                },

                {
                    id: "school_locker",
                    name: "Loker Evan",
                    icon: "🔐",
                    evidence: "locker_note",
                    description:
                        "Di dalamnya ditemukan catatan pribadi Evan."
                },

                {
                    id: "school_clock",
                    name: "Jam Koridor",
                    icon: "🕰️",
                    evidence: "clock_record",
                    description:
                        "Jam koridor berhenti ketika listrik sempat padam."
                },

                {
                    id: "key_registry",
                    name: "Buku Peminjaman Kunci",
                    icon: "🔑",
                    evidence: "victor_key_log",
                    description:
                        "Buku administrasi mencatat siapa yang mengambil kunci Gedung Lama."
                }

            ]
        },


        library: {
            name: "Perpustakaan",
            icon: "📚",
            description:
                "Tempat Evan terakhir tercatat secara resmi sebelum menuju sayap timur.",

            objects: [

                {
                    id: "library_book",
                    name: "Buku Pinjaman",
                    icon: "📖",
                    evidence: "library_record",
                    description:
                        "Kartu peminjaman menunjukkan Evan masih berada di sekolah pada pukul 18:05."
                },

                {
                    id: "library_note",
                    name: "Catatan Tersembunyi",
                    icon: "📝",
                    evidence: "hidden_note",
                    description:
                        "Pesan kecil ditemukan di antara halaman buku."
                },

                {
                    id: "library_window",
                    name: "Jendela Belakang",
                    icon: "🪟",
                    evidence: "window_trace",
                    description:
                        "Ada jejak tanah basah pada bingkai jendela."
                }

            ]
        },


        oldBuilding: {
            name: "Gedung Lama",
            icon: "🏚️",
            description:
                "Bangunan tua yang secara resmi sudah tidak digunakan. Pintu utamanya dikunci setiap sore.",

            objects: [

                {
                    id: "old_chair",
                    name: "Kursi Tua",
                    icon: "🪑",
                    evidence: "chair_trace",
                    description:
                        "Kursi baru saja digunakan."
                },

                {
                    id: "old_box",
                    name: "Kotak Dokumen",
                    icon: "📦",
                    evidence: "old_document",
                    description:
                        "Kotak berisi arsip lama sekolah."
                },

                {
                    id: "basement_door",
                    name: "Pintu Ruang Bawah",
                    icon: "🚪",
                    evidence: "basement_trace",
                    description:
                        "Pintu tersembunyi berada di balik rak dokumen."
                },

                {
                    id: "old_window",
                    name: "Jendela Samping",
                    icon: "🪟",
                    evidence: "old_window_trace",
                    description:
                        "Jendela baru saja dibuka dari dalam."
                }

            ]
        },


        sideGate: {
            name: "Gerbang Samping",
            icon: "🚪",
            description:
                "Gerbang kecil yang biasanya digunakan staf sekolah.",

            objects: [

                {
                    id: "gate_lock",
                    name: "Gembok",
                    icon: "🔒",
                    evidence: "gate_scratch",
                    description:
                        "Terdapat goresan baru pada sisi dalam gembok."
                },

                {
                    id: "gate_camera",
                    name: "Kamera Gerbang",
                    icon: "📹",
                    evidence: "gate_camera",
                    description:
                        "Kamera mencatat seseorang melewati area gerbang."
                }

            ]
        },


        field: {
            name: "Lapangan",
            icon: "🏀",
            description:
                "Lapangan mulai kosong setelah kegiatan sore.",

            objects: [

                {
                    id: "field_bench",
                    name: "Bangku",
                    icon: "🪑",
                    evidence: "bench_message",
                    description:
                        "Ada pesan misterius di bagian bawah bangku."
                },

                {
                    id: "field_bag",
                    name: "Tas Marcus",
                    icon: "🎒",
                    evidence: "red_herring_bag",
                    description:
                        "Tas Marcus ditemukan di dekat lapangan."
                }

            ]
        },


        evanHouse: {
            name: "Rumah Evan",
            icon: "🏠",
            description:
                "Rumah Evan. Keluarga memberikan informasi tambahan.",

            objects: [

                {
                    id: "evan_desk",
                    name: "Meja Evan",
                    icon: "🗃️",
                    evidence: "old_photo",
                    description:
                        "Ada foto lama yang tidak tercantum dalam laporan awal."
                },

                {
                    id: "evan_phone",
                    name: "Ponsel Cadangan",
                    icon: "📱",
                    evidence: "phone_message",
                    description:
                        "Satu pesan dari nomor tidak dikenal belum dibuka."
                }

            ]
        }

    },


    /* =====================================================
       EVIDENCE
       ===================================================== */

    evidence: {

        camera_log: {
            title: "Rekaman Kamera Koridor",
            type: "DIGITAL",
            icon: "📹",
            importance: 3,
            description:
                "Pukul 18:21, Evan terlihat berjalan menuju sayap timur. Beberapa detik kemudian seseorang berjalan ke arah yang sama."
        },

        locker_note: {
            title: "Catatan Dalam Loker",
            type: "DOCUMENT",
            icon: "📝",
            importance: 2,
            description:
                "Tulisan Evan: 'Jangan percaya orang yang datang setelah jam enam.'"
        },

        clock_record: {
            title: "Catatan Jam Koridor",
            type: "TIMELINE",
            icon: "🕰️",
            importance: 2,
            description:
                "Jam koridor berhenti pada 18:21 karena gangguan listrik. Kamera menggunakan waktu server."
        },

        library_record: {
            title: "Log Perpustakaan",
            type: "RECORD",
            icon: "📚",
            importance: 2,
            description:
                "Kartu Evan digunakan untuk meminjam buku pada pukul 18:05."
        },

        hidden_note: {
            title: "Pesan Tersembunyi",
            type: "SECRET",
            icon: "🔎",
            importance: 5,
            secret: true,
            description:
                "Pesan tersebut berbunyi: '18:30. Gedung lama. Datang sendiri.'"
        },

        window_trace: {
            title: "Jejak Tanah",
            type: "TRACE",
            icon: "🪟",
            importance: 2,
            description:
                "Tanah basah ditemukan pada sisi jendela belakang."
        },

        chair_trace: {
            title: "Posisi Kursi",
            type: "PHYSICAL",
            icon: "🪑",
            importance: 2,
            description:
                "Debu di lantai menunjukkan kursi baru saja digunakan."
        },

        old_document: {
            title: "Dokumen Lama",
            type: "DOCUMENT",
            icon: "📄",
            importance: 4,
            description:
                "Arsip lama menunjukkan adanya ruang penyimpanan bawah tanah yang ditutup setelah insiden bertahun-tahun lalu."
        },

        basement_trace: {
            title: "Bekas Pintu Ruang Bawah",
            type: "PHYSICAL",
            icon: "🚪",
            importance: 4,
            description:
                "Kunci mekanis baru saja digunakan. Goresan pada lubang kunci masih terlihat."
        },

        old_window_trace: {
            title: "Jendela Gedung Lama",
            type: "PHYSICAL",
            icon: "🪟",
            importance: 2,
            description:
                "Jendela samping dibuka dari dalam. Tidak ada kerusakan pada kunci."
        },

        gate_scratch: {
            title: "Goresan Pada Gembok",
            type: "PHYSICAL",
            icon: "🔒",
            importance: 3,
            description:
                "Gembok menunjukkan bekas manipulasi baru dari sisi dalam."
        },

        gate_camera: {
            title: "Rekaman Kamera Gerbang",
            type: "DIGITAL",
            icon: "📹",
            importance: 3,
            description:
                "Seseorang dengan jaket gelap terlihat melewati gerbang pada pukul 18:39."
        },

        bench_message: {
            title: "Pesan di Bangku",
            type: "MESSAGE",
            icon: "✉️",
            importance: 3,
            description:
                "Pesan berbunyi: 'Kau terlambat. Aku sudah tahu semuanya.'"
        },

        red_herring_bag: {
            title: "Tas Marcus",
            type: "RED HERRING",
            icon: "🎒",
            importance: 1,
            redHerring: true,
            description:
                "Tas Marcus ditemukan di lapangan. Isinya hanya perlengkapan olahraga. Mencurigakan, tetapi tidak membuktikan Marcus bertemu Evan."
        },

        victor_key_log: {
            title: "Catatan Kunci Victor",
            type: "CRITICAL",
            icon: "🔑",
            importance: 5,
            critical: true,
            description:
                "Victor Hale mengambil kunci Gedung Lama pukul 18:12 dan mengembalikannya pukul 18:47."
        },

        old_photo: {
            title: "Foto Lama",
            type: "SECRET",
            icon: "📷",
            importance: 5,
            secret: true,
            description:
                "Foto memperlihatkan Evan bersama seseorang yang berkaitan dengan insiden lama Gedung Lama."
        },

        phone_message: {
            title: "Pesan Ponsel",
            type: "SECRET",
            icon: "📱",
            importance: 5,
            secret: true,
            description:
                "Pesan dari nomor tak dikenal: 'Kalau kau ingin tahu apa yang terjadi dulu, datang ke tempat lama.'"
        }

    },


    /* =====================================================
       SUSPECTS
       ===================================================== */

    suspects: [

        {
            id: "clara",
            name: "Clara Morgan",
            role: "Teman dekat Evan",
            avatar: "👩",
            status: "TENANG",

            alibi:
                "Mengaku pulang langsung setelah sekolah.",

            motive:
                "Bertengkar dengan Evan karena Evan menyembunyikan sesuatu.",

            truth:
                "Clara sebenarnya masih berada di sekolah sampai sekitar 18:15.",

            firstStatement:
                "Aku pulang setelah sekolah. Aku tidak melihat Evan lagi.",

            changedStatement:
                "Baik. Aku masih berada di sekolah sampai sekitar 18:15. Tapi setelah itu aku pergi.",

            contradiction:
                "Alibinya berubah setelah ditanya mengenai keberadaannya setelah jam sekolah."

        },


        {
            id: "marcus",
            name: "Marcus Reed",
            role: "Teman sekelas Evan",
            avatar: "👨",
            status: "GUGUP",

            alibi:
                "Mengaku berada di lapangan untuk latihan basket.",

            motive:
                "Evan pernah melaporkan kecurangan Marcus dalam tugas sekolah.",

            truth:
                "Marcus memang meninggalkan lapangan sebentar untuk mengambil tas, tetapi kembali sebelum 18:20.",

            firstStatement:
                "Aku di lapangan. Aku tidak punya urusan dengan Evan.",

            changedStatement:
                "Aku memang pergi sebentar mengambil tas. Tapi itu sebelum Evan pergi ke Gedung Lama.",

            contradiction:
                "Marcus menyembunyikan bahwa ia meninggalkan lapangan, tetapi waktunya tidak cocok dengan kejadian utama."

        },


        {
            id: "elena",
            name: "Elena Carter",
            role: "Kakak Evan",
            avatar: "👩‍🦰",
            status: "TERTEKAN",

            alibi:
                "Mengaku berada di rumah sejak sore.",

            motive:
                "Khawatir Evan menemukan rahasia keluarga.",

            truth:
                "Elena mengetahui Evan menemukan dokumen lama, tetapi tidak mengetahui pertemuan pukul 18:30.",

            firstStatement:
                "Evan hanya terlalu penasaran. Aku tidak tahu apa yang sedang dia cari.",

            changedStatement:
                "Aku tahu dia menemukan sesuatu. Tapi aku tidak tahu dia akan pergi ke Gedung Lama.",

            contradiction:
                "Elena awalnya menyembunyikan bahwa ia mengetahui penyelidikan Evan."

        },


        {
            id: "victor",
            name: "Victor Hale",
            role: "Penjaga sekolah",
            avatar: "🧔",
            status: "WASPADA",

            alibi:
                "Mengaku berada di gerbang utama dan memeriksa pintu masuk sampai sekitar 18:40.",

            motive:
                "Victor mengetahui rahasia Gedung Lama dan ruang bawah tanah.",

            truth:
                "Victor mengambil kunci pukul 18:12, menemui Evan sekitar 18:30, lalu meninggalkan area sekitar 18:39. Ia ingin menghentikan Evan membuka rahasia lama.",

            firstStatement:
                "Aku berada di gerbang utama. Aku tidak pergi ke Gedung Lama malam itu.",

            changedStatement:
                "Baik... aku memang mengambil kunci Gedung Lama. Tapi aku tidak bertemu Evan di sana.",

            contradiction:
                "Catatan kunci membuktikan Victor memiliki akses ke Gedung Lama sementara ia mengaku berada di gerbang.",

            culprit: true
        }

    ],


    /* =====================================================
       TIMELINE
       ===================================================== */

    timeline: [

        {
            id: "t1805",
            time: "18:05",
            title: "Evan tercatat di perpustakaan"
        },

        {
            id: "t1812",
            time: "18:12",
            title: "Victor mengambil kunci Gedung Lama"
        },

        {
            id: "t1821",
            time: "18:21",
            title: "Evan terlihat di koridor"
        },

        {
            id: "t1830",
            time: "18:30",
            title: "Pertemuan di Gedung Lama"
        },

        {
            id: "t1839",
            time: "18:39",
            title: "Seseorang melewati gerbang samping"
        },

        {
            id: "t1847",
            time: "18:47",
            title: "Kunci Gedung Lama dikembalikan"
        }

    ]

};


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    forceModalClosed();

    createDynamicScreens();

    bindGlobalEvents();

    loadGame();

    startLoading();

});


/* =========================================================
   LOADING
   IMPORTANT:
   Loading hanya tampil sekali.
   Tidak boleh mengunci layar setelah selesai.
========================================================= */

function startLoading() {

    const loading = $("loadingScreen");
    const progress = $("loadingProgress");

    if (!loading) {
        showScreen("mainMenu");
        return;
    }

    forceModalClosed();

    showScreen("loadingScreen");

    let value = 0;

    const timer = setInterval(() => {

        value += Math.floor(Math.random() * 15) + 8;

        if (value >= 100) {
            value = 100;
        }

        if (progress) {
            progress.style.width = value + "%";
        }

        if (value >= 100) {

            clearInterval(timer);

            setTimeout(() => {

                showScreen("mainMenu");

            }, 350);

        }

    }, 100);

}


/* =========================================================
   SCREEN SYSTEM
========================================================= */

function showScreen(id) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(screen => {

        screen.classList.remove("active");

        screen.classList.add("hidden");

        screen.style.display = "none";

    });


    const target = $(id);

    if (!target) {
        return;
    }


    target.classList.remove("hidden");

    target.classList.add("active");

    target.style.display = "block";

    game.currentScreen = id;


    /*
       JANGAN scrollTo(0,0).

       Ini sengaja dihapus karena sebelumnya
       setiap klik membuat halaman meloncat ke atas.
    */
}


/* =========================================================
   CREATE DYNAMIC SCREENS
========================================================= */

function createDynamicScreens() {

    const existing = [
        "investigation",
        "locationScreen",
        "evidenceScreen",
        "evidenceDetail",
        "suspectsScreen",
        "suspectDetail",
        "interrogationScreen",
        "timelineScreen",
        "boardScreen",
        "deductionScreen",
        "journalScreen",
        "accusationScreen",
        "resultScreen"
    ];

    existing.forEach(id => {

        const element = $(id);

        if (element) {
            element.classList.add("hidden");
        }

    });

}


/* =========================================================
   GLOBAL EVENTS
========================================================= */

function bindGlobalEvents() {

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeModal();
        }

    });


    /*
       Jika user menekan tombol browser BACK,
       jangan biarkan modal membuat layar macet.
    */

    window.addEventListener("pageshow", () => {
        forceModalClosed();
    });

}


/* =========================================================
   MODAL SAFETY
========================================================= */

function forceModalClosed() {

    const modal = $("modal");

    if (!modal) {
        return;
    }

    modal.classList.add("hidden");

    modal.classList.remove("active");

    modal.style.display = "none";

    modal.style.pointerEvents = "none";

    document.body.classList.remove("modal-open");

}


function openModal(
    icon = "🔎",
    title = "Information",
    content = "",
    actions = []
) {

    const modal = $("modal");

    if (!modal) {
        return;
    }


    const modalIcon = $("modalIcon");
    const modalTitle = $("modalTitle");
    const modalText = $("modalText");
    const modalActions = $("modalActions");


    if (modalIcon) {
        modalIcon.textContent = icon;
    }

    if (modalTitle) {
        modalTitle.textContent = title;
    }

    if (modalText) {
        modalText.innerHTML = content;
    }


    if (modalActions) {

        modalActions.innerHTML = "";

        actions.forEach(action => {

            const button =
                document.createElement("button");

            button.textContent =
                action.text || "OK";

            button.className =
                action.className || "main-button";

            button.type = "button";

            button.addEventListener("click", () => {

                if (typeof action.action === "function") {
                    action.action();
                }

            });

            modalActions.appendChild(button);

        });

    }


    modal.classList.remove("hidden");

    modal.classList.add("active");

    modal.style.display = "flex";

    modal.style.pointerEvents = "auto";

    document.body.classList.add("modal-open");

}


function closeModal() {

    forceModalClosed();

}


/* =========================================================
   NOTIFICATION
========================================================= */

let notificationTimer = null;

function notify(message, icon = "🔎") {

    const box = $("notification");

    const text = $("notificationText");

    const iconBox = $("notificationIcon");


    if (!box) {
        return;
    }


    if (text) {
        text.textContent = message;
    }

    if (iconBox) {
        iconBox.textContent = icon;
    }


    box.classList.add("show");


    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {

        box.classList.remove("show");

    }, 2600);

}


/* =========================================================
   MENU
========================================================= */

function startCase() {

    if (!game.investigationStarted) {

        game.investigationStarted = true;

        addJournalQuestion(
            "Siapa yang terakhir melihat Evan?"
        );

        addJournalQuestion(
            "Mengapa Victor menyembunyikan akses ke Gedung Lama?"
        );

        addJournalQuestion(
            "Apa hubungan insiden lama dengan hilangnya Evan?"
        );

    }


    saveGame();

    showScreen("caseIntro");

}


function enterInvestigation() {

    showInvestigation();

    notify(
        "Investigasi dimulai. Periksa setiap lokasi.",
        "🔎"
    );

}


function showHowToPlay() {

    showScreen("howToPlay");

}


function backToMenu() {

    closeModal();

    showScreen("mainMenu");

}


function backToInvestigation() {

    closeModal();

    showInvestigation();

}


function backToEvidence() {

    showEvidence();

}


function backToSuspects() {

    showSuspects();

}


function backToSuspectDetail() {

    if (game.currentSuspect) {

        showSuspectDetail(
            game.currentSuspect
        );

    } else {

        showSuspects();

    }

}


/* =========================================================
   INVESTIGATION HUB
========================================================= */

function showInvestigation() {

    showScreen("investigation");

    updateInvestigationCounters();

}


function updateInvestigationCounters() {

    const count =
        $("evidenceCount");

    const toolCount =
        $("evidenceToolCount");


    if (count) {
        count.textContent =
            game.evidenceFound.length;
    }


    if (toolCount) {
        toolCount.textContent =
            `${game.evidenceFound.length} discovered`;
    }

}


/* =========================================================
   LOCATION INVESTIGATION
========================================================= */

function searchLocation(locationId) {

    const location =
        CASE_DATA.locations[locationId];

    if (!location) {
        return;
    }


    game.currentLocation = locationId;


    if (!game.visitedLocations.includes(locationId)) {

        game.visitedLocations.push(locationId);

        game.score += 5;

    }


    const type =
        $("locationType");

    const title =
        $("locationTitle");

    const icon =
        $("locationIcon");

    const description =
        $("locationDescription");

    const grid =
        $("objectsGrid");


    if (type) {
        type.textContent = "LOCATION";
    }

    if (title) {
        title.textContent =
            location.name.toUpperCase();
    }

    if (icon) {
        icon.textContent =
            location.icon;
    }

    if (description) {
        description.textContent =
            location.description;
    }


    if (grid) {

        grid.innerHTML = "";


        location.objects.forEach(object => {

            const found =
                game.investigatedObjects.includes(
                    object.id
                );


            const button =
                document.createElement("button");

            button.className =
                "object-card";


            button.innerHTML = `

                <span class="object-icon">
                    ${object.icon}
                </span>

                <strong>
                    ${esc(object.name)}
                </strong>

                <small>
                    ${
                        found
                            ? "✓ Investigated"
                            : "Search object"
                    }
                </small>

            `;


            button.type = "button";


            button.addEventListener("click", () => {

                inspectObject(
                    locationId,
                    object.id
                );

            });


            grid.appendChild(button);

        });

    }


    showScreen("locationScreen");

}


/* =========================================================
   OBJECT INSPECTION
========================================================= */

function inspectObject(
    locationId,
    objectId
) {

    const location =
        CASE_DATA.locations[locationId];

    if (!location) {
        return;
    }


    const object =
        location.objects.find(
            item => item.id === objectId
        );

    if (!object) {
        return;
    }


    if (!game.investigatedObjects.includes(objectId)) {

        game.investigatedObjects.push(objectId);

        game.score += 5;

    }


    const evidenceId =
        object.evidence;

    const evidence =
        CASE_DATA.evidence[evidenceId];


    if (evidence) {

        discoverEvidence(evidenceId);

    }


    openModal(

        object.icon,

        object.name,

        `
            <p>${esc(object.description)}</p>

            ${
                evidence
                    ? `
                        <div class="evidence-preview">
                            <strong>
                                BUKTI TERKAIT
                            </strong>

                            <p>
                                ${evidence.icon}
                                ${esc(evidence.title)}
                            </p>
                        </div>
                    `
                    : ""
            }
        `,

        [

            {
                text: "TUTUP",
                action: closeModal
            },

            ...(evidence ? [

                {
                    text: "PERIKSA BUKTI",
                    action: () => {

                        closeModal();

                        inspectEvidence(
                            evidenceId
                        );

                    }
                }

            ] : [])

        ]

    );


    saveGame();

}


/* =========================================================
   DISCOVER EVIDENCE
========================================================= */

function discoverEvidence(id) {

    if (!CASE_DATA.evidence[id]) {
        return;
    }


    if (
        game.evidenceFound.includes(id)
    ) {

        return;

    }


    game.evidenceFound.push(id);


    const evidence =
        CASE_DATA.evidence[id];


    game.score +=
        evidence.importance * 5;


    addJournalEvidence(id);


    if (evidence.secret) {

        game.discoveredSecrets.push(id);

        addJournalConclusion(
            `Bukti rahasia ditemukan: ${evidence.title}`
        );

    }


    if (evidence.critical) {

        addJournalConclusion(
            "Akses Victor ke Gedung Lama telah terbukti."
        );

    }


    notify(
        `Bukti ditemukan: ${evidence.title}`,
        evidence.icon
    );


    updateInvestigationCounters();

    saveGame();

}


/* =========================================================
   EVIDENCE SCREEN
========================================================= */

function openEvidence() {

    showEvidence();

}


function showEvidence(filter = "all") {

    const list =
        $("evidenceList");

    if (!list) {
        return;
    }


    list.innerHTML = "";


    const evidenceItems =
        game.evidenceFound
            .map(id => ({
                id,
                ...CASE_DATA.evidence[id]
            }))
            .filter(item => {

                if (filter === "all") {
                    return true;
                }

                return item.type.toLowerCase()
                    .includes(filter.toLowerCase());

            });


    if (evidenceItems.length === 0) {

        list.innerHTML = `

            <div class="empty-message">
                Belum ada bukti ditemukan.
            </div>

        `;

    }


    evidenceItems.forEach(item => {

        const card =
            document.createElement("button");

        card.className =
            "evidence-card";

        card.type = "button";


        card.innerHTML = `

            <span class="evidence-card-icon">
                ${item.icon}
            </span>

            <div>

                <span class="evidence-type">
                    ${esc(item.type)}
                </span>

                <h3>
                    ${esc(item.title)}
                </h3>

                <p>
                    ${esc(item.description)}
                </p>

            </div>

        `;


        card.addEventListener("click", () => {

            inspectEvidence(item.id);

        });


        list.appendChild(card);

    });


    showScreen("evidenceScreen");

}


function filterEvidence(type) {

    showEvidence(type);

}


/* =========================================================
   EVIDENCE DETAIL
========================================================= */

function inspectEvidence(id) {

    /*
       Bisa dipanggil tanpa ID dari HTML.
    */

    if (!id) {

        id = game.currentEvidence;

    }


    const evidence =
        CASE_DATA.evidence[id];

    if (!evidence) {
        return;
    }


    game.currentEvidence = id;


    const index =
        game.evidenceFound.indexOf(id) + 1;


    const number =
        $("detailEvidenceNumber");

    const icon =
        $("detailEvidenceIcon");

    const type =
        $("detailEvidenceType");

    const title =
        $("detailEvidenceTitle");

    const description =
        $("detailEvidenceDescription");


    if (number) {
        number.textContent =
            `#${String(index).padStart(2, "0")}`;
    }

    if (icon) {
        icon.textContent =
            evidence.icon;
    }

    if (type) {
        type.textContent =
            evidence.type;
    }

    if (title) {
        title.textContent =
            evidence.title;
    }

    if (description) {
        description.textContent =
            evidence.description;
    }


    showScreen("evidenceDetail");

}


function compareEvidence() {

    const current =
        CASE_DATA.evidence[
            game.currentEvidence
        ];


    if (!current) {
        return;
    }


    const candidates =
        game.evidenceFound
            .filter(id =>
                id !== game.currentEvidence
            );


    if (candidates.length === 0) {

        notify(
            "Belum ada bukti lain untuk dibandingkan.",
            "⚠️"
        );

        return;

    }


    const related =
        findRelatedEvidence(
            game.currentEvidence
        );


    if (related) {

        openModal(

            "↔️",

            "PERBANDINGAN BUKTI",

            `
                <p>
                    <strong>${esc(current.title)}</strong>
                </p>

                <p>
                    memiliki hubungan dengan:
                </p>

                <div class="comparison-box">
                    ${related.icon}
                    <strong>
                        ${esc(related.title)}
                    </strong>

                    <p>
                        ${esc(related.description)}
                    </p>
                </div>
            `,

            [
                {
                    text: "TUTUP",
                    action: closeModal
                }
            ]

        );

    } else {

        notify(
            "Belum ditemukan hubungan langsung.",
            "🔎"
        );

    }

}


function findRelatedEvidence(id) {

    const relations = {

        camera_log: [
            "clock_record",
            "hidden_note"
        ],

        clock_record: [
            "camera_log",
            "library_record"
        ],

        hidden_note: [
            "camera_log",
            "victor_key_log"
        ],

        victor_key_log: [
            "old_document",
            "gate_camera",
            "hidden_note"
        ],

        old_document: [
            "basement_trace",
            "victor_key_log"
        ],

        basement_trace: [
            "old_document",
            "victor_key_log"
        ],

        gate_camera: [
            "victor_key_log"
        ]

    };


    const possible =
        relations[id] || [];


    const found =
        possible.find(
            evidenceId =>
                game.evidenceFound.includes(
                    evidenceId
                )
        );


    return found
        ? CASE_DATA.evidence[found]
        : null;

}


function noteEvidence() {

    const evidence =
        CASE_DATA.evidence[
            game.currentEvidence
        ];


    if (!evidence) {
        return;
    }


    addJournalConclusion(
        `Catatan pribadi: ${evidence.title} mungkin penting untuk rekonstruksi.`
    );


    notify(
        "Catatan ditambahkan ke Journal.",
        "📝"
    );


    saveGame();

}


function connectEvidence() {

    const id =
        game.currentEvidence;


    if (!id) {
        return;
    }


    game.selectedBoardEvidence = [id];


    showEvidenceBoard();


    notify(
        "Pilih satu bukti lagi untuk membuat hubungan.",
        "🧩"
    );

}


/* =========================================================
   SUSPECTS
========================================================= */

function openSuspects() {

    showSuspects();

}


function showSuspects() {

    const list =
        $("suspectsList");

    if (!list) {
        return;
    }


    list.innerHTML = "";


    CASE_DATA.suspects.forEach(suspect => {

        const interviewed =
            game.interviewedSuspects.includes(
                suspect.id
            );


        const contradiction =
            game.contradictionsFound.includes(
                suspect.id
            );


        const card =
            document.createElement("button");

        card.className =
            "suspect-card";

        card.type = "button";


        card.innerHTML = `

            <div class="suspect-avatar">
                ${suspect.avatar}
            </div>

            <div>

                <h3>
                    ${esc(suspect.name)}
                </h3>

                <span>
                    ${esc(suspect.role)}
                </span>

                <small>
                    ${
                        contradiction
                            ? "⚠️ CONTRADICTION FOUND"
                            : interviewed
                                ? "✓ INTERVIEWED"
                                : "NOT INTERVIEWED"
                    }
                </small>

            </div>

        `;


        card.addEventListener("click", () => {

            showSuspectDetail(
                suspect.id
            );

        });


        list.appendChild(card);

    });


    showScreen("suspectsScreen");

}


function showSuspectDetail(id) {

    const suspect =
        CASE_DATA.suspects.find(
            item => item.id === id
        );


    if (!suspect) {
        return;
    }


    game.currentSuspect = id;


    if (!game.journal.suspects.includes(id)) {

        game.journal.suspects.push(id);

    }


    $("suspectDetailName").textContent =
        suspect.name;

    $("suspectName").textContent =
        suspect.name;

    $("suspectRelation").textContent =
        suspect.role;

    $("suspectAvatar").textContent =
        suspect.avatar;

    $("suspectAlibi").textContent =
        suspect.alibi;


    const interviewed =
        game.interviewedSuspects.includes(id);


    $("suspectAlibiStatus").textContent =
        interviewed
            ? "QUESTIONED"
            : "UNVERIFIED";


    $("suspectTrust").textContent =
        getTrust(id) + "%";


    const contradictionBox =
        $("suspectContradictions");


    if (contradictionBox) {

        if (
            game.contradictionsFound.includes(id)
        ) {

            contradictionBox.innerHTML = `

                <div class="contradiction">
                    ⚠️ ${esc(suspect.contradiction)}
                </div>

            `;

        } else {

            contradictionBox.innerHTML = `

                <p class="empty-message">
                    No contradiction discovered.
                </p>

            `;

        }

    }


    showScreen("suspectDetail");

}


function getTrust(id) {

    if (
        game.contradictionsFound.includes(id)
    ) {
        return 25;
    }

    if (
        game.interviewedSuspects.includes(id)
    ) {
        return 55;
    }

    return 50;

}


/* =========================================================
   INTERROGATION
========================================================= */

function startInterrogation(id) {

    if (!id) {
        id = game.currentSuspect;
    }


    const suspect =
        CASE_DATA.suspects.find(
            item => item.id === id
        );


    if (!suspect) {
        return;
    }


    game.currentSuspect = id;

    game.interrogationStep = 0;


    if (
        !game.interviewedSuspects.includes(id)
    ) {

        game.interviewedSuspects.push(id);

    }


    $("interrogationName").textContent =
        suspect.name;

    $("interrogationAvatar").textContent =
        suspect.avatar;


    addJournalConclusion(
        `Interogasi ${suspect.name} dimulai.`
    );


    showScreen("interrogationScreen");

    renderInterrogation();

    saveGame();

}


function renderInterrogation() {

    const suspect =
        CASE_DATA.suspects.find(
            item => item.id === game.currentSuspect
        );


    if (!suspect) {
        return;
    }


    const step =
        game.interrogationStep;


    let speaker = "DETECTIVE";

    let text = "";

    let choices = [];


    if (step === 0) {

        text =
            "Di mana kamu berada ketika Evan terakhir terlihat?";


        choices = [

            {
                text: "Aku ingin melihat alibimu.",
                type: "alibi"
            },

            {
                text: "Ceritakan hubunganmu dengan Evan.",
                type: "relationship"
            },

            {
                text: "Tunjukkan bukti keberadaanmu.",
                type: "evidence"
            }

        ];

    }


    else if (step === 1) {

        speaker = suspect.name;


        text =
            suspect.firstStatement;


        choices = [

            {
                text: "Aku menemukan sesuatu yang tidak cocok.",
                type: "challenge"
            },

            {
                text: "Lanjutkan ceritamu.",
                type: "continue"
            }

        ];

    }


    else if (step === 2) {

        speaker = "DETECTIVE";


        text =
            getInterrogationChallenge(
                suspect
            );


        choices = [

            {
                text: "Tunjukkan bukti.",
                type: "showEvidence"
            },

            {
                text: "Tekan dengan pertanyaan lain.",
                type: "pressure"
            }

        ];

    }


    else {

        speaker = suspect.name;


        text =
            suspect.changedStatement;


        choices = [

            {
                text: "Aku mencatat perubahan pernyataanmu.",
                type: "record"
            },

            {
                text: "Selesai untuk sekarang.",
                type: "finish"
            }

        ];

    }


    $("speakerName").textContent =
        speaker;

    $("dialogueText").textContent =
        text;


    const choicesBox =
        $("dialogueChoices");


    if (!choicesBox) {
        return;
    }


    choicesBox.innerHTML = "";


    choices.forEach((choice, index) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "dialogue-choice";


        button.textContent =
            choice.text;


        button.addEventListener("click", () => {

            handleInterrogationChoice(
                index,
                choice.type
            );

        });


        choicesBox.appendChild(button);

    });


    updateReaction();

}


function getInterrogationChallenge(suspect) {

    if (suspect.id === "clara") {

        return "Kamu bilang langsung pulang. Tetapi ada indikasi kamu masih berada di sekolah setelah jam pulang.";

    }


    if (suspect.id === "marcus") {

        return "Tasmu ditemukan di lapangan. Tetapi catatan waktumu menunjukkan kamu sempat pergi.";

    }


    if (suspect.id === "elena") {

        return "Kamu mengatakan tidak tahu apa yang Evan cari. Tetapi ada bukti bahwa kamu mengetahui dokumen lama.";

    }


    if (suspect.id === "victor") {

        return "Kamu bilang berada di gerbang. Lalu bagaimana menjelaskan catatan pengambilan kunci Gedung Lama pukul 18:12?";

    }


    return "Ada bagian dari ceritamu yang belum cocok dengan bukti.";

}


function handleInterrogationChoice(
    index,
    type
) {

    const suspect =
        CASE_DATA.suspects.find(
            item => item.id === game.currentSuspect
        );


    if (!suspect) {
        return;
    }


    switch (type) {

        case "alibi":

            notify(
                `Alibi: ${suspect.alibi}`,
                "📋"
            );

            break;


        case "relationship":

            openModal(

                "👤",

                "HUBUNGAN",

                `
                    <p>
                        ${esc(suspect.motive)}
                    </p>
                `,

                [
                    {
                        text: "LANJUT",
                        action: closeModal
                    }
                ]

            );

            break;


        case "evidence":

            const found =
                game.evidenceFound.length > 0;

            if (found) {

                openModal(

                    "🔎",

                    "BUKTI PENYELIDIKAN",

                    `
                        <p>
                            Detektif menunjukkan
                            beberapa bukti yang telah ditemukan.
                        </p>

                        <p>
                            Tersangka mulai berhati-hati.
                        </p>
                    `,

                    [
                        {
                            text: "LANJUT",
                            action: () => {

                                closeModal();

                                game.interrogationStep = 1;

                                renderInterrogation();

                            }
                        }
                    ]

                );

            } else {

                notify(
                    "Cari bukti terlebih dahulu.",
                    "⚠️"
                );

            }

            return;


        case "challenge":

            game.interrogationStep = 2;

            if (
                !game.contradictionsFound.includes(
                    suspect.id
                )
            ) {

                game.contradictionsFound.push(
                    suspect.id
                );

                game.score += 15;

                addJournalConclusion(
                    `Kontradiksi ditemukan pada alibi ${suspect.name}.`
                );

                notify(
                    `Kontradiksi ditemukan: ${suspect.name}`,
                    "⚠️"
                );

            }

            renderInterrogation();

            saveGame();

            return;


        case "continue":

            game.interrogationStep = 2;

            renderInterrogation();

            return;


        case "showEvidence":

            const relevant =
                getRelevantEvidenceForSuspect(
                    suspect.id
                );


            if (relevant) {

                discoverEvidence(relevant);

                game.score += 10;

                notify(
                    "Bukti membuat tersangka mulai gugup.",
                    "⚠️"
                );

            } else {

                notify(
                    "Belum ada bukti yang cukup kuat.",
                    "🔎"
                );

            }

            game.interrogationStep = 3;

            renderInterrogation();

            return;


        case "pressure":

            game.interrogationStep = 3;

            renderInterrogation();

            return;


        case "record":

            if (
                !game.changedStatements.includes(
                    suspect.id
                )
            ) {

                game.changedStatements.push(
                    suspect.id
                );

                game.score += 20;

                addJournalConclusion(
                    `Pernyataan ${suspect.name} berubah setelah ditekan.`
                );

            }

            notify(
                "Perubahan pernyataan dicatat.",
                "📝"
            );

            renderInterrogation();

            saveGame();

            return;


        case "finish":

            if (
                !game.changedStatements.includes(
                    suspect.id
                ) &&
                game.interrogationStep >= 3
            ) {

                game.changedStatements.push(
                    suspect.id
                );

            }

            backToSuspectDetail();

            return;

    }


    /*
       Default progression
    */

    game.interrogationStep++;

    renderInterrogation();

}


/* =========================================================
   RELEVANT SUSPECT EVIDENCE
========================================================= */

function getRelevantEvidenceForSuspect(id) {

    const map = {

        clara: "camera_log",

        marcus: "red_herring_bag",

        elena: "old_document",

        victor: "victor_key_log"

    };


    const evidenceId =
        map[id];


    if (
        evidenceId &&
        game.evidenceFound.includes(evidenceId)
    ) {

        return evidenceId;

    }


    return null;

}


/* =========================================================
   TIMELINE
========================================================= */

function openTimeline() {

    showTimeline();

}


function showTimeline() {

    const container =
        $("timelineItems");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    let items = [...CASE_DATA.timeline];


    /*
       Acak tampilan.
    */

    items.sort(
        () => Math.random() - 0.5
    );


    game.timelineOrder = [];


    items.forEach((item, index) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "timeline-item";


        button.dataset.index =
            index;


        button.innerHTML = `

            <span class="timeline-number">
                ${index + 1}
            </span>

            <div>

                <strong>
                    ${item.time}
                </strong>

                <p>
                    ${esc(item.title)}
                </p>

            </div>

        `;


        button.addEventListener("click", () => {

            selectTimelineItem(
                item.id,
                button
            );

        });


        container.appendChild(button);

    });


    showScreen("timelineScreen");

}


function selectTimelineItem(
    id,
    button
) {

    if (
        game.timelineOrder.includes(id)
    ) {

        return;

    }


    game.timelineOrder.push(id);


    button.classList.add("selected");


    const number =
        button.querySelector(
            ".timeline-number"
        );


    if (number) {

        number.textContent =
            game.timelineOrder.length;

    }

}


function selectTimeline(index) {

    const items =
        CASE_DATA.timeline;

    if (
        items[index]
    ) {

        game.timelineOrder.push(
            items[index].id
        );

    }

}


function checkTimeline() {

    if (
        game.timelineOrder.length !==
        CASE_DATA.timeline.length
    ) {

        notify(
            "Susun semua kejadian terlebih dahulu.",
            "⚠️"
        );

        return;

    }


    const correct =
        game.timelineOrder.every(
            (id, index) =>
                id === CASE_DATA.timeline[index].id
        );


    if (correct) {

        game.score += 40;

        addJournalConclusion(
            "Timeline utama berhasil direkonstruksi."
        );


        unlockAchievement(
            "TIMELINE MASTER"
        );


        openModal(

            "🕒",

            "TIMELINE BENAR",

            `
                <p>
                    Semua kejadian berhasil disusun
                    sesuai urutan waktu.
                </p>

                <p>
                    Sekarang hubungan antara
                    Victor, Gedung Lama, dan Evan
                    menjadi lebih jelas.
                </p>
            `,

            [
                {
                    text: "LANJUT",
                    action: closeModal
                }
            ]

        );

    } else {

        game.score =
            Math.max(0, game.score - 5);


        notify(
            "Urutan masih memiliki konflik.",
            "⚠️"
        );


        highlightTimelineError();

    }


    saveGame();

}


function highlightTimelineError() {

    const buttons =
        document.querySelectorAll(
            "#timelineItems .timeline-item"
        );


    buttons.forEach(button => {

        button.classList.add("timeline-error");

        setTimeout(() => {

            button.classList.remove(
                "timeline-error"
            );

        }, 700);

    });

}


/* =========================================================
   EVIDENCE BOARD
========================================================= */

function openEvidenceBoard() {

    showEvidenceBoard();

}


function showEvidenceBoard() {

    const board =
        $("boardEvidence");


    if (!board) {
        return;
    }


    board.innerHTML = "";


    if (game.evidenceFound.length < 2) {

        board.innerHTML = `

            <div class="empty-message">

                Temukan minimal 2 bukti
                untuk menghubungkan petunjuk.

            </div>

        `;

    }


    game.evidenceFound.forEach(id => {

        const evidence =
            CASE_DATA.evidence[id];


        if (!evidence) {
            return;
        }


        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "board-evidence-card";


        if (
            game.selectedBoardEvidence.includes(id)
        ) {

            button.classList.add(
                "selected"
            );

        }


        button.innerHTML = `

            <span>
                ${evidence.icon}
            </span>

            <strong>
                ${esc(evidence.title)}
            </strong>

            <small>
                ${esc(evidence.type)}
            </small>

        `;


        button.addEventListener("click", () => {

            selectBoardEvidence(id);

        });


        board.appendChild(button);

    });


    updateConnectionResult();


    showScreen("boardScreen");

}


function selectBoardEvidence(id) {

    if (
        game.selectedBoardEvidence.includes(id)
    ) {

        game.selectedBoardEvidence =
            game.selectedBoardEvidence.filter(
                item => item !== id
            );

        showEvidenceBoard();

        return;

    }


    if (
        game.selectedBoardEvidence.length >= 2
    ) {

        game.selectedBoardEvidence = [];

    }


    game.selectedBoardEvidence.push(id);


    if (
        game.selectedBoardEvidence.length === 2
    ) {

        evaluateConnection();

    }


    showEvidenceBoard();

}


function updateConnectionResult() {

    const result =
        $("connectionResult");


    if (!result) {
        return;
    }


    if (
        game.selectedBoardEvidence.length === 0
    ) {

        result.textContent =
            "Pilih dua bukti.";

        return;

    }


    if (
        game.selectedBoardEvidence.length === 1
    ) {

        const evidence =
            CASE_DATA.evidence[
                game.selectedBoardEvidence[0]
            ];


        result.textContent =
            `Dipilih: ${evidence.title}. Pilih satu lagi.`;

        return;

    }


    result.textContent =
        "Dua bukti dipilih. Memeriksa hubungan...";

}


function evaluateConnection() {

    const [a, b] =
        game.selectedBoardEvidence;


    const pair =
        [a, b].sort().join("|");


    const correctPairs = [

        [
            "camera_log",
            "clock_record"
        ],

        [
            "camera_log",
            "hidden_note"
        ],

        [
            "hidden_note",
            "victor_key_log"
        ],

        [
            "old_document",
            "basement_trace"
        ],

        [
            "old_document",
            "victor_key_log"
        ],

        [
            "gate_camera",
            "victor_key_log"
        ],

        [
            "basement_trace",
            "victor_key_log"
        ]

    ].map(
        pair => pair.sort().join("|")
    );


    if (
        correctPairs.includes(pair)
    ) {

        game.score += 25;


        if (
            pair.includes("hidden_note") &&
            pair.includes("victor_key_log")
        ) {

            if (
                !game.hiddenConnections.includes(
                    "victor-hidden-note"
                )
            ) {

                game.hiddenConnections.push(
                    "victor-hidden-note"
                );

            }

        }


        addJournalConclusion(
            `Hubungan bukti ditemukan: ${CASE_DATA.evidence[a].title} + ${CASE_DATA.evidence[b].title}`
        );


        notify(
            "Hubungan bukti benar ditemukan.",
            "🧩"
        );


        unlockAchievement(
            "EVIDENCE CONNECTOR"
        );


        updateConnectionResult();

    } else {

        notify(
            "Kedua bukti belum memiliki hubungan langsung.",
            "❌"
        );

    }


    saveGame();

}


/* =========================================================
   DEDUCTION
========================================================= */

function openDeduction() {

    showDeduction();

}


function showDeduction() {

    updateDeductionUI();

    showScreen("deductionScreen");

}


function updateDeductionUI() {

    const a =
        $("deductionA");

    const b =
        $("deductionB");

    const conclusion =
        $("deductionConclusion");


    if (a) {

        a.textContent =
            game.deductionA
                ? CASE_DATA.evidence[
                    game.deductionA
                  ].title
                : "+";

    }


    if (b) {

        b.textContent =
            game.deductionB
                ? CASE_DATA.evidence[
                    game.deductionB
                  ].title
                : "+";

    }


    if (conclusion) {

        if (
            game.deductionA ===
                "hidden_note" &&
            game.deductionB ===
                "victor_key_log"
        ) {

            conclusion.textContent =
                "Victor memiliki akses dan janji bertemu Evan.";

        }

        else if (
            game.deductionA ===
                "old_document" &&
            game.deductionB ===
                "basement_trace"
        ) {

            conclusion.textContent =
                "Ruang bawah Gedung Lama baru saja digunakan.";

        }

        else {

            conclusion.textContent =
                "?";

        }

    }

}


function chooseDeduction(slot) {

    if (game.evidenceFound.length === 0) {

        notify(
            "Belum ada bukti.",
            "⚠️"
        );

        return;

    }


    openEvidencePicker(slot);

}


function chooseDeductionEvidence(id) {

    /*
       Kompatibilitas dengan versi lama.
    */

    if (!game.deductionA) {

        game.deductionA = id;

    }

    else {

        game.deductionB = id;

    }


    updateDeductionUI();

}


function openEvidencePicker(slot) {

    const buttons =
        game.evidenceFound.map(id => {

            const evidence =
                CASE_DATA.evidence[id];


            return {

                text:
                    `${evidence.icon} ${evidence.title}`,

                action: () => {

                    if (slot === "a") {

                        game.deductionA = id;

                    } else {

                        game.deductionB = id;

                    }


                    closeModal();

                    updateDeductionUI();

                }

            };

        });


    openModal(

        "🧠",

        slot === "a"
            ? "PILIH CLUE A"
            : "PILIH CLUE B",

        `
            <p>
                Pilih bukti yang ingin digunakan
                dalam deduksi.
            </p>
        `,

        buttons

    );

}


function submitDeduction() {

    if (
        !game.deductionA ||
        !game.deductionB
    ) {

        notify(
            "Isi kedua clue terlebih dahulu.",
            "⚠️"
        );

        return;

    }


    const correct =
        (
            game.deductionA === "hidden_note" &&
            game.deductionB === "victor_key_log"
        )
        ||
        (
            game.deductionA === "victor_key_log" &&
            game.deductionB === "hidden_note"
        );


    if (correct) {

        game.score += 35;


        addJournalConclusion(
            "Deduksi utama: Victor memiliki akses ke Gedung Lama dan memiliki hubungan langsung dengan pertemuan Evan pukul 18:30."
        );


        unlockAchievement(
            "MASTER DEDUCTION"
        );


        openModal(

            "🧠",

            "DEDUKSI BERHASIL",

            `
                <p>
                    Catatan pertemuan Evan menunjukkan
                    waktu dan lokasi.
                </p>

                <p>
                    Catatan kunci menunjukkan Victor
                    memiliki akses pada waktu yang sama.
                </p>

                <p>
                    <strong>
                        Victor tidak hanya memiliki kesempatan,
                        tetapi juga menyembunyikan aksesnya.
                    </strong>
                </p>
            `,

            [
                {
                    text: "CATAT & LANJUT",
                    action: () => {

                        closeModal();

                        addJournalConclusion(
                            "Victor adalah tersangka utama."
                        );

                        saveGame();

                    }
                }
            ]

        );

    } else {

        notify(
            "Hubungan itu belum cukup kuat.",
            "❌"
        );

    }


    saveGame();

}


/* =========================================================
   JOURNAL
========================================================= */

function openJournal() {

    showJournal();

}


function showJournal() {

    showJournalTab(
        "suspects"
    );

    showScreen("journalScreen");

}


function showJournalTab(tab) {

    const content =
        $("journalContent");


    if (!content) {
        return;
    }


    if (tab === "suspects") {

        content.innerHTML = `

            <h3>TERSANGKA</h3>

            ${
                game.journal.suspects.length
                    ? game.journal.suspects.map(id => {

                        const suspect =
                            CASE_DATA.suspects.find(
                                item => item.id === id
                            );

                        return `

                            <div class="journal-entry">

                                <strong>
                                    ${esc(suspect.name)}
                                </strong>

                                <p>
                                    ${esc(suspect.role)}
                                </p>

                            </div>

                        `;

                    }).join("")
                    : `<p class="empty-message">
                        Belum ada tersangka diperiksa.
                    </p>`
            }

        `;

    }


    else if (tab === "evidence") {

        content.innerHTML = `

            <h3>BUKTI</h3>

            ${
                game.evidenceFound.length
                    ? game.evidenceFound.map(id => {

                        const evidence =
                            CASE_DATA.evidence[id];

                        return `

                            <div class="journal-entry">

                                <strong>
                                    ${evidence.icon}
                                    ${esc(evidence.title)}
                                </strong>

                                <p>
                                    ${esc(evidence.description)}
                                </p>

                            </div>

                        `;

                    }).join("")
                    : `<p class="empty-message">
                        Belum ada bukti.
                    </p>`
            }

        `;

    }


    else if (tab === "conclusions") {

        content.innerHTML = `

            <h3>KESIMPULAN</h3>

            ${
                game.journal.conclusions.length
                    ? game.journal.conclusions.map(
                        text => `

                            <div class="journal-entry">

                                <p>
                                    ${esc(text)}
                                </p>

                            </div>

                        `
                    ).join("")
                    : `<p class="empty-message">
                        Belum ada kesimpulan.
                    </p>`
            }

        `;

    }


    else if (tab === "questions") {

        content.innerHTML = `

            <h3>PERTANYAAN</h3>

            ${
                game.journal.questions.length
                    ? game.journal.questions.map(
                        text => `

                            <div class="journal-entry">

                                <p>
                                    ❓ ${esc(text)}
                                </p>

                            </div>

                        `
                    ).join("")
                    : `<p class="empty-message">
                        Tidak ada pertanyaan.
                    </p>`
            }

        `;

    }

}


/* =========================================================
   JOURNAL HELPERS
========================================================= */

function addJournalEvidence(id) {

    if (
        !game.journal.evidence.includes(id)
    ) {

        game.journal.evidence.push(id);

    }

}


function addJournalConclusion(text) {

    if (
        !game.journal.conclusions.includes(text)
    ) {

        game.journal.conclusions.push(text);

    }

}


function addJournalQuestion(text) {

    if (
        !game.journal.questions.includes(text)
    ) {

        game.journal.questions.push(text);

    }

}


/* =========================================================
   RECONSTRUCTION
========================================================= */

function reconstructCase() {

    const required = [

        "camera_log",
        "hidden_note",
        "old_document",
        "victor_key_log"

    ];


    const ready =
        required.every(
            id =>
                game.evidenceFound.includes(id)
        );


    if (!ready) {

        notify(
            "Belum cukup bukti untuk rekonstruksi.",
            "⚠️"
        );

        return;

    }


    openModal(

        "🎬",

        "REKONSTRUKSI KEJADIAN",

        `

            <div class="reconstruction">

                <p>
                    <strong>18:05</strong>
                    — Evan tercatat di perpustakaan.
                </p>

                <p>
                    <strong>18:12</strong>
                    — Victor mengambil kunci Gedung Lama.
                </p>

                <p>
                    <strong>18:21</strong>
                    — Evan terlihat menuju sayap timur.
                </p>

                <p>
                    <strong>18:30</strong>
                    — Evan tiba di Gedung Lama
                    untuk pertemuan rahasia.
                </p>

                <p>
                    <strong>18:39</strong>
                    — Seseorang terlihat
                    meninggalkan area sekolah.
                </p>

                <p>
                    <strong>18:47</strong>
                    — Kunci Gedung Lama dikembalikan.
                </p>

                <hr>

                <p>
                    Rangkaian waktu menunjukkan
                    Victor memiliki kesempatan untuk
                    berada di Gedung Lama pada saat
                    Evan berada di sana.
                </p>

            </div>

        `,

        [

            {
                text: "CATAT",
                action: () => {

                    addJournalConclusion(
                        "Rekonstruksi 18:05–18:47 menunjukkan Victor memiliki akses ke Gedung Lama selama pertemuan Evan."
                    );

                    notify(
                        "Rekonstruksi disimpan.",
                        "🎬"
                    );

                    closeModal();

                    saveGame();

                }
            },

            {
                text: "TUTUP",
                action: closeModal
            }

        ]

    );

}


/* =========================================================
   FINAL ACCUSATION
========================================================= */

function openAccusation() {

    populateAccusationEvidence();

    showScreen("accusationScreen");

}


function populateAccusationEvidence() {

    const select =
        $("mainEvidence");


    if (!select) {
        return;
    }


    select.innerHTML = `

        <option value="">
            Select evidence
        </option>

    `;


    game.evidenceFound.forEach(id => {

        const evidence =
            CASE_DATA.evidence[id];


        const option =
            document.createElement("option");


        option.value = id;

        option.textContent =
            `${evidence.icon} ${evidence.title}`;


        select.appendChild(option);

    });

}


/* =========================================================
   FINAL ACCUSATION LOGIC
   ========================================================= */

function submitAccusation() {

    const person =
        $("accusedPerson")?.value;

    const time =
        $("accusedTime")?.value;

    const location =
        $("accusedLocation")?.value;

    const motive =
        $("accusedMotive")?.value;

    const evidence =
        $("mainEvidence")?.value;


    if (
        !person ||
        !time ||
        !location ||
        !motive ||
        !evidence
    ) {

        notify(
            "Lengkapi semua bagian tuduhan.",
            "⚠️"
        );

        return;

    }


    game.accusationAttempts++;


    /*
       =====================================================
       TRUE SOLUTION CASE #001
       =====================================================

       PELAKU   : Victor Hale
       WAKTU    : 18:30
       LOKASI   : Gedung Lama
       MOTIF    : Protect a Secret
       BUKTI    : Catatan Kunci Victor

       Hanya kombinasi ini yang TRUE.
    */


    const correctPerson =
        person === "victor";


    const correctTime =
        time === "1830";


    const correctLocation =
        location === "oldBuilding";


    const correctMotive =
        motive === "secret";


    const correctEvidence =
        evidence === "victor_key_log";


    const total =
        [
            correctPerson,
            correctTime,
            correctLocation,
            correctMotive,
            correctEvidence
        ].filter(Boolean).length;


    /*
       Tidak ada lagi sistem:
       "pilih apa saja tetap benar".

       Kalau salah satu bagian salah,
       tuduhan tidak dianggap TRUE.
    */


    if (total === 5) {

        solveCase();

    }

    else if (total >= 3) {

        showGoodEnding(
            {
                person,
                time,
                location,
                motive,
                evidence
            }
        );

    }

    else {

        showWrongEnding(
            {
                person,
                time,
                location,
                motive,
                evidence
            }
        );

    }


    saveGame();

}


/* =========================================================
   TRUE ENDING
========================================================= */

function solveCase() {

    game.caseSolved = true;

    game.finalEnding = "true";

    game.reputation += 100;

    game.score += 100;


    unlockAchievement(
        "CASE SOLVED"
    );


    addJournalConclusion(
        "KESIMPULAN AKHIR: Victor Hale adalah pelaku utama."
    );


    addJournalConclusion(
        "Victor menemui Evan di Gedung Lama pukul 18:30 untuk menghentikan Evan membuka rahasia lama."
    );


    showResultScreen(
        "true"
    );

}


/* =========================================================
   GOOD ENDING
========================================================= */

function showGoodEnding(accusation) {

    game.finalEnding =
        "good";


    game.caseSolved = false;

    game.reputation += 40;


    showResultScreen(
        "good",
        accusation
    );

}


/* =========================================================
   WRONG ENDING
========================================================= */

function showWrongEnding(accusation) {

    game.finalEnding =
        "wrong";


    game.caseSolved = false;

    game.reputation =
        Math.max(
            0,
            game.reputation - 10
        );


    showResultScreen(
        "wrong",
        accusation
    );

}


/* =========================================================
   RESULT SCREEN
========================================================= */

function showResultScreen(
    ending,
    accusation = null
) {

    const icon =
        $("resultIcon");

    const label =
        $("resultLabel");

    const title =
        $("resultTitle");

    const description =
        $("resultDescription");

    const stars =
        $("ratingStars");

    const finalEvidence =
        $("finalEvidence");

    const finalContradictions =
        $("finalContradictions");

    const finalSecrets =
        $("finalSecrets");


    let data;


    if (ending === "true") {

        data = {

            icon: "🏆",

            label: "TRUE ENDING",

            title: "KASUS TERPECAHKAN",

            description:
                "Semua bagian penting berhasil disatukan. Victor Hale terbukti memiliki akses ke Gedung Lama dan berada di pusat kejadian pukul 18:30.",

            stars: "★★★★★"

        };

    }


    else if (ending === "good") {

        data = {

            icon: "🔎",

            label: "GOOD ENDING",

            title: "HAMPIR BENAR",

            description:
                "Sebagian besar teorimu benar, tetapi masih ada detail penting yang tidak cocok.",

            stars: "★★★★☆"

        };

    }


    else {

        data = {

            icon: "⚠️",

            label: "WRONG ACCUSATION",

            title: "TUDUHAN DITOLAK",

            description:
                "Kesimpulanmu belum cocok dengan seluruh fakta kasus. Ada bagian penting yang masih terlewat.",

            stars: "★★☆☆☆"

        };

    }


    if (icon) {
        icon.textContent =
            data.icon;
    }

    if (label) {
        label.textContent =
            data.label;
    }

    if (title) {
        title.textContent =
            data.title;
    }

    if (description) {
        description.textContent =
            data.description;
    }

    if (stars) {
        stars.textContent =
            data.stars;
    }

    if (finalEvidence) {
        finalEvidence.textContent =
            `${game.evidenceFound.length}/16`;
    }

    if (finalContradictions) {
        finalContradictions.textContent =
            game.contradictionsFound.length;
    }

    if (finalSecrets) {
        finalSecrets.textContent =
            game.discoveredSecrets.length;
    }


    showScreen("resultScreen");


    if (ending === "true") {

        notify(
            "TRUE ENDING — Kasus berhasil dipecahkan!",
            "🏆"
        );

    }

    else if (ending === "good") {

        notify(
            "GOOD ENDING — Masih ada fakta yang terlewat.",
            "🔎"
        );

    }

    else {

        notify(
            "WRONG ACCUSATION — Investigasi belum selesai.",
            "⚠️"
        );

    }

}


/* =========================================================
   ACHIEVEMENT
========================================================= */

function unlockAchievement(name) {

    if (
        game.achievements.includes(name)
    ) {

        return;

    }


    game.achievements.push(name);


    notify(
        `Achievement: ${name}`,
        "🏆"
    );


    saveGame();

}


/* =========================================================
   SAVE GAME
========================================================= */

function saveGame() {

    try {

        localStorage.setItem(
            "caseFiles001Save",
            JSON.stringify(game)
        );

    } catch (error) {

        console.warn(
            "Save gagal:",
            error
        );

    }

}


/* =========================================================
   LOAD GAME
========================================================= */

function loadGame() {

    try {

        const saved =
            localStorage.getItem(
                "caseFiles001Save"
            );


        if (!saved) {
            return;
        }


        const data =
            JSON.parse(saved);


        Object.keys(game).forEach(key => {

            if (
                data[key] !== undefined
            ) {

                game[key] =
                    data[key];

            }

        });


        /*
           Pastikan array tidak rusak.
        */

        const arrays = [

            "evidenceFound",
            "visitedLocations",
            "investigatedObjects",
            "interviewedSuspects",
            "contradictionsFound",
            "changedStatements",
            "hiddenConnections",
            "discoveredSecrets",
            "achievements",
            "selectedBoardEvidence",
            "timelineOrder"

        ];


        arrays.forEach(key => {

            if (
                !Array.isArray(
                    game[key]
                )
            ) {

                game[key] = [];

            }

        });


        if (
            !game.journal ||
            typeof game.journal !== "object"
        ) {

            game.journal = {

                suspects: [],
                evidence: [],
                conclusions: [],
                questions: []

            };

        }


    } catch (error) {

        console.warn(
            "Load save gagal:",
            error
        );

    }

}


/* =========================================================
   RESET
========================================================= */

function resetGame() {

    const confirmReset =
        window.confirm(
            "Reset seluruh progress CASE FILES #001?"
        );


    if (!confirmReset) {
        return;
    }


    localStorage.removeItem(
        "caseFiles001Save"
    );


    location.reload();

}


/* =========================================================
   COMPATIBILITY FUNCTIONS
   Untuk tombol/function versi HTML lama
========================================================= */

function showAccusation() {
    openAccusation();
}


function showDeductionScreen() {
    showDeduction();
}


function showEvidenceBoardScreen() {
    showEvidenceBoard();
}


function showJournalScreen() {
    showJournal();
}


function showTimelineScreen() {
    showTimeline();
}


/* =========================================================
   AUTO CLOSE STALE MODAL
   =========================================================

   Jika modal somehow tertinggal karena browser reload,
   modal akan dibersihkan.
========================================================= */

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            /*
               Hanya tutup modal kalau loading sudah selesai.
            */

            const loading =
                $("loadingScreen");

            const modal =
                $("modal");


            if (
                loading &&
                loading.classList.contains("hidden") &&
                modal
            ) {

                forceModalClosed();

            }

        }, 500);

    }
);


/* =========================================================
   FINAL SAFETY
========================================================= */

window.closeModal =
    closeModal;

window.openModal =
    openModal;

window.startCase =
    startCase;

window.showHowToPlay =
    showHowToPlay;

window.backToMenu =
    backToMenu;

window.enterInvestigation =
    enterInvestigation;

window.searchLocation =
    searchLocation;

window.openEvidence =
    openEvidence;

window.filterEvidence =
    filterEvidence;

window.inspectEvidence =
    inspectEvidence;

window.compareEvidence =
    compareEvidence;

window.noteEvidence =
    noteEvidence;

window.connectEvidence =
    connectEvidence;

window.openSuspects =
    openSuspects;

window.startInterrogation =
    startInterrogation;

window.openTimeline =
    openTimeline;

window.checkTimeline =
    checkTimeline;

window.openEvidenceBoard =
    openEvidenceBoard;

window.openDeduction =
    openDeduction;

window.chooseDeduction =
    chooseDeduction;

window.submitDeduction =
    submitDeduction;

window.openJournal =
    openJournal;

window.showJournalTab =
    showJournalTab;

window.reconstructCase =
    reconstructCase;

window.openAccusation =
    openAccusation;

window.submitAccusation =
    submitAccusation;

window.resetGame =
    resetGame;


/* =========================================================
   END
========================================================= */