const pkcs11js = require('pkcs11js');
const path = require('path');

const Card = (function () {
    function Card() {
        // this.data = {};
        this.cardNumber =
            this.validityBeginDate =
            this.validityEndDate =
            this.issuingMunicipality =
            this.nationalNumber =
            this.surname =
            this.firstNames =
            this.firstLetterOfThirdGivenName =
            this.nationality =
            this.locationOfBirth =
            this.dateOfBirth =
            this.gender =
            this.nobility =
            this.documentType =
            this.specialStatus =
            this.dateAndCountryOfProtection =
            this.workPermitMention =
            this.employerVat1 =
            this.employerVat2 =
            this.regionalFileNumber =
            this.addressStreetAndNumber =
            this.addressZip =
            this.addressMunicipality = null;
        this.readCard();
    }
    Card.prototype.initPkcs11 = function () {
        try {
            Card.pkcs11.load(path.join(__dirname, 'beidpkcs11.dll').split(path.sep).join('/'));
            Card.pkcs11.C_Initialize();
        }
        catch (error) {
            console.error(error);
        }
    };
    Card.prototype.readCard = function () {
        this.initPkcs11();
        const slots = Card.pkcs11.C_GetSlotList(true);
        const slot = slots[0];
        const session = Card.pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
        Card.pkcs11.C_FindObjectsInit(session, [{ type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_DATA }]);
        let hObject = Card.pkcs11.C_FindObjects(session);
        while (hObject) {
            const attrs = Card.pkcs11.C_GetAttributeValue(session, hObject, [
                { type: pkcs11js.CKA_LABEL },
                { type: pkcs11js.CKA_VALUE }
            ]);
            if (attrs[0].value !== undefined && attrs[1].value !== undefined) {
                const key = attrs[0].value.toString();
                const value = attrs[1].value;
                // this.data[key] = value;
                switch (key) {
                    case 'card_number':
                        this.cardNumber = value.toString();
                    case 'validity_begin_date':
                        this.validityBeginDate = value.toString();
                    case 'validity_end_date':
                        this.validityEndDate = value.toString();
                    case 'issuing_municipality':
                        this.issuingMunicipality = value.toString();
                    case 'national_number':
                        this.nationalNumber = value.toString();
                    case 'surname':
                        this.surname = value.toString();
                    case 'firstnames':
                        this.firstNames = value.toString();
                    case 'first_letter_of_third_given_name':
                        this.firstLetterOfThirdGivenName = value.toString();
                    case 'nationality':
                        this.nationality = value.toString();
                    case 'location_of_birth':
                        this.locationOfBirth = value.toString();
                    case 'date_of_birth':
                        this.dateOfBirth = value.toString();
                    case 'gender':
                        this.gender = value.toString();
                    case 'nobility':
                        this.nobility = value.toString();
                    case 'document_type':
                        this.documentType = value.toString();
                    case 'special_status':
                        this.specialStatus = value.toString();
                    case 'date_and_country_of_protection':
                        this.dateAndCountryOfProtection = value.toString();
                    case 'work_permit_mention':
                        this.workPermitMention = value.toString();
                    case 'employer_vat_1':
                        this.employerVat1 = value.toString();
                    case 'employer_vat_2':
                        this.employerVat2 = value.toString();
                    case 'regional_file_number':
                        this.regionalFileNumber = value.toString();
                    case 'address_street_and_number':
                        this.addressStreetAndNumber = value.toString();
                    case 'address_zip':
                        this.addressZip = value.toString();
                    case 'address_municipality':
                        this.addressMunicipality = value.toString();
                }
            }
            hObject = Card.pkcs11.C_FindObjects(session);
        }
        Card.pkcs11.close();
    };
    Card.pkcs11 = new pkcs11js.PKCS11();
    return Card;
}());

module.exports = Card;