"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
exports.schema = {
    type: 'object',
    properties: {
        concurrencyAutoscaling: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'object',
                    properties: {
                        function: {
                            type: 'string',
                            minLength: 1
                        },
                        name: {
                            type: 'string',
                            minLength: 1
                        },
                        enabled: {
                            type: 'boolean'
                        },
                        alias: {
                            type: 'string',
                            minLength: 1
                        },
                        maximum: {
                            type: 'integer',
                            minimum: 0
                        },
                        minimum: {
                            type: 'integer',
                            minimum: 0
                        },
                        usage: {
                            type: 'number',
                            minimum: 0,
                        },
                        scaleInCooldown: {
                            type: 'integer',
                            minimum: 0
                        },
                        scaleOutCooldown: {
                            type: 'integer',
                            minimum: 0
                        },
                        customMetric: {
                            type: 'object',
                            properties: {
                                statistic: {
                                    type: 'string',
                                    enum: ['Average', 'Maximum', 'Minimum', 'SampleCount', 'Sum',
                                        'average', 'maximum', 'minimum', 'sampleCount', 'sum']
                                },
                            },
                            additionalProperties: true,
                            required: ['statistic']
                        },
                        scheduledActions: {
                            type: 'array',
                            minItems: 1,
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        minLength: 1
                                    },
                                    startTime: {
                                        type: 'string',
                                        minLength: 1,
                                        pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\\d|3[0-1])T(?:[0-1]\\d|2[0-3]):[0-5]\\d:[0-5]\\dZ$'
                                    },
                                    endTime: {
                                        type: 'string',
                                        minLength: 1,
                                        pattern: '^\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\\d|3[0-1])T(?:[0-1]\\d|2[0-3]):[0-5]\\d:[0-5]\\dZ$'
                                    },
                                    timezone: {
                                        type: 'string',
                                        enum: ["Etc/GMT+12", "Etc/GMT+11", "Pacific/Midway", "Pacific/Niue", "Pacific/Pago_Pago", "America/Adak", "Etc/GMT+10", "HST", "Pacific/Honolulu", "Pacific/Rarotonga", "Pacific/Tahiti", "Pacific/Marquesas", "America/Anchorage", "America/Juneau", "America/Metlakatla", "America/Nome", "America/Sitka", "America/Yakutat", "Etc/GMT+9", "Pacific/Gambier", "America/Dawson", "America/Los_Angeles", "America/Tijuana", "America/Vancouver", "America/Whitehorse", "Etc/GMT+8", "PST8PDT", "Pacific/Pitcairn", "America/Boise", "America/Cambridge_Bay", "America/Chihuahua", "America/Creston", "America/Dawson_Creek", "America/Denver", "America/Edmonton", "America/Fort_Nelson", "America/Hermosillo", "America/Inuvik", "America/Mazatlan", "America/Ojinaga", "America/Phoenix", "America/Yellowknife", "Etc/GMT+7", "MST", "MST7MDT", "America/Bahia_Banderas", "America/Belize", "America/Chicago", "America/Costa_Rica", "America/El_Salvador", "America/Guatemala", "America/Indiana/Knox", "America/Indiana/Tell_City", "America/Managua", "America/Matamoros", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Monterrey", "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Rainy_River", "America/Rankin_Inlet", "America/Regina", "America/Resolute", "America/Swift_Current", "America/Tegucigalpa", "America/Winnipeg", "CST6CDT", "Etc/GMT+6", "Pacific/Easter", "Pacific/Galapagos", "America/Atikokan", "America/Bogota", "America/Cancun", "America/Cayman", "America/Detroit", "America/Eirunepe", "America/Grand_Turk", "America/Guayaquil", "America/Havana", "America/Indiana/Indianapolis", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Iqaluit", "America/Jamaica", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Lima", "America/Nassau", "America/New_York", "America/Nipigon", "America/Panama", "America/Pangnirtung", "America/Port-au-Prince", "America/Rio_Branco", "America/Thunder_Bay", "America/Toronto", "EST", "EST5EDT", "Etc/GMT+5", "America/Anguilla", "America/Antigua", "America/Aruba", "America/Asuncion", "America/Barbados", "America/Blanc-Sablon", "America/Boa_Vista", "America/Campo_Grande", "America/Caracas", "America/Cuiaba", "America/Curacao", "America/Dominica", "America/Glace_Bay", "America/Goose_Bay", "America/Grenada", "America/Guadeloupe", "America/Guyana", "America/Halifax", "America/Kralendijk", "America/La_Paz", "America/Lower_Princes", "America/Manaus", "America/Marigot", "America/Martinique", "America/Moncton", "America/Montserrat", "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Santiago", "America/Santo_Domingo", "America/St_Barthelemy", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Thule", "America/Tortola", "Atlantic/Bermuda", "Etc/GMT+4", "America/St_Johns", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Bahia", "America/Belem", "America/Cayenne", "America/Fortaleza", "America/Godthab", "America/Maceio", "America/Miquelon", "America/Montevideo", "America/Paramaribo", "America/Punta_Arenas", "America/Recife", "America/Santarem", "America/Sao_Paulo", "Antarctica/Palmer", "Antarctica/Rothera", "Atlantic/Stanley", "Etc/GMT+3", "America/Noronha", "Atlantic/South_Georgia", "Etc/GMT+2", "America/Scoresbysund", "Atlantic/Azores", "Atlantic/Cape_Verde", "Etc/GMT+1", "Africa/Abidjan", "Africa/Accra", "Africa/Bamako", "Africa/Banjul", "Africa/Bissau", "Africa/Casablanca", "Africa/Conakry", "Africa/Dakar", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Lome", "Africa/Monrovia", "Africa/Nouakchott", "Africa/Ouagadougou", "America/Danmarkshavn", "Antarctica/Troll", "Atlantic/Canary", "Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/St_Helena", "Etc/GMT", "Etc/UCT", "Etc/UTC", "Europe/Dublin", "Europe/Guernsey", "Europe/Isle_of_Man", "Europe/Jersey", "Europe/Lisbon", "Europe/London", "UTC", "WET", "Africa/Algiers", "Africa/Bangui", "Africa/Brazzaville", "Africa/Ceuta", "Africa/Douala", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Luanda", "Africa/Malabo", "Africa/Ndjamena", "Africa/Niamey", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tunis", "Africa/Windhoek", "Arctic/Longyearbyen", "CET", "Etc/GMT-1", "Europe/Amsterdam", "Europe/Andorra", "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Budapest", "Europe/Busingen", "Europe/Copenhagen", "Europe/Gibraltar", "Europe/Ljubljana", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Monaco", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Rome", "Europe/San_Marino", "Europe/Sarajevo", "Europe/Skopje", "Europe/Stockholm", "Europe/Tirane", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Warsaw", "Europe/Zagreb", "Europe/Zurich", "MET", "Africa/Blantyre", "Africa/Bujumbura", "Africa/Cairo", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Khartoum", "Africa/Kigali", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Tripoli", "Asia/Amman", "Asia/Beirut", "Asia/Damascus", "Asia/Famagusta", "Asia/Gaza", "Asia/Hebron", "Asia/Jerusalem", "Asia/Nicosia", "EET", "Etc/GMT-2", "Europe/Athens", "Europe/Bucharest", "Europe/Chisinau", "Europe/Helsinki", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Mariehamn", "Europe/Nicosia", "Europe/Riga", "Europe/Sofia", "Europe/Tallinn", "Europe/Uzhgorod", "Europe/Vilnius", "Europe/Zaporozhye", "Africa/Addis_Ababa", "Africa/Asmara", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Juba", "Africa/Kampala", "Africa/Mogadishu", "Africa/Nairobi", "Antarctica/Syowa", "Asia/Aden", "Asia/Baghdad", "Asia/Bahrain", "Asia/Istanbul", "Asia/Kuwait", "Asia/Qatar", "Asia/Riyadh", "Etc/GMT-3", "Europe/Istanbul", "Europe/Kirov", "Europe/Minsk", "Europe/Moscow", "Europe/Simferopol", "Indian/Antananarivo", "Indian/Comoro", "Indian/Mayotte", "Asia/Tehran", "Asia/Baku", "Asia/Dubai", "Asia/Muscat", "Asia/Tbilisi", "Asia/Yerevan", "Etc/GMT-4", "Europe/Astrakhan", "Europe/Samara", "Europe/Saratov", "Europe/Ulyanovsk", "Europe/Volgograd", "Indian/Mahe", "Indian/Mauritius", "Indian/Reunion", "Asia/Kabul", "Antarctica/Mawson", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Atyrau", "Asia/Dushanbe", "Asia/Karachi", "Asia/Oral", "Asia/Samarkand", "Asia/Tashkent", "Asia/Yekaterinburg", "Etc/GMT-5", "Indian/Kerguelen", "Indian/Maldives", "Asia/Colombo", "Asia/Kolkata", "Asia/Kathmandu", "Antarctica/Vostok", "Asia/Almaty", "Asia/Bishkek", "Asia/Dhaka", "Asia/Omsk", "Asia/Qyzylorda", "Asia/Thimphu", "Asia/Urumqi", "Etc/GMT-6", "Indian/Chagos", "Asia/Yangon", "Indian/Cocos", "Antarctica/Davis", "Asia/Bangkok", "Asia/Barnaul", "Asia/Ho_Chi_Minh", "Asia/Hovd", "Asia/Jakarta", "Asia/Krasnoyarsk", "Asia/Novokuznetsk", "Asia/Novosibirsk", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Tomsk", "Asia/Vientiane", "Etc/GMT-7", "Indian/Christmas", "Antarctica/Casey", "Asia/Brunei", "Asia/Choibalsan", "Asia/Hong_Kong", "Asia/Irkutsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Macau", "Asia/Makassar", "Asia/Manila", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Ulaanbaatar", "Australia/Perth", "Etc/GMT-8", "Australia/Eucla", "Asia/Chita", "Asia/Dili", "Asia/Jayapura", "Asia/Khandyga", "Asia/Pyongyang", "Asia/Seoul", "Asia/Tokyo", "Asia/Yakutsk", "Etc/GMT-9", "Pacific/Palau", "Australia/Adelaide", "Australia/Broken_Hill", "Australia/Darwin", "Antarctica/DumontDUrville", "Asia/Ust-Nera", "Asia/Vladivostok", "Australia/Brisbane", "Australia/Currie", "Australia/Hobart", "Australia/Lindeman", "Australia/Melbourne", "Australia/Sydney", "Etc/GMT-10", "Pacific/Chuuk", "Pacific/Guam", "Pacific/Port_Moresby", "Pacific/Saipan", "Australia/Lord_Howe", "Antarctica/Macquarie", "Asia/Magadan", "Asia/Sakhalin", "Asia/Srednekolymsk", "Etc/GMT-11", "Pacific/Bougainville", "Pacific/Efate", "Pacific/Guadalcanal", "Pacific/Kosrae", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pohnpei", "Antarctica/McMurdo", "Asia/Anadyr", "Asia/Kamchatka", "Etc/GMT-12", "Pacific/Auckland", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Nauru", "Pacific/Tarawa", "Pacific/Wake", "Pacific/Wallis", "Pacific/Chatham", "Etc/GMT-13", "Pacific/Apia", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Tongatapu", "Etc/GMT-14", "Pacific/Kiritimati"]
                                    },
                                    schedule: {
                                        type: 'string',
                                        minLength: 1,
                                        oneOf: [{
                                                pattern: '^rate\\([1-9]\\d*\\s(minute|minutes|hour|hours|day|days)\\)$'
                                            }, {
                                                pattern: '^at\\(\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\)$'
                                            }, {
                                                pattern: '^cron\\((\\d+|/|\\*|,|-|\\d-\\d)\\s(\\d+|/|\\*|,|-|\\d-\\d)\\s(\\d+|/|\\?|L|W|\\*|,|-|\\d-\\d)\\s(\\d+|/|\\*|,|-|\\d-\\d)\\s(\\d+|\\?|\\*|,|-|L|#|\\d-\\d)\\s(\\d+|/|\\*|,|-|\\d-\\d)\\)$'
                                            }]
                                    },
                                    action: {
                                        type: 'object',
                                        properties: {
                                            maximum: {
                                                type: 'integer',
                                                minimum: 0
                                            },
                                            minimum: {
                                                type: 'integer',
                                                minimum: 0
                                            },
                                        },
                                        additionalProperties: false,
                                        anyOf: [
                                            { "required": ["maximum", "minimum"] },
                                            { "required": ["maximum"] },
                                            { "required": ["minimum"] }
                                        ]
                                    },
                                },
                                required: ['name', 'schedule', 'action'],
                                additionalProperties: false,
                            },
                        },
                    },
                    additionalProperties: false
                },
            ],
        },
    },
    additionalProperties: true
};
//# sourceMappingURL=schema.js.map