package patient.telehealth.redimed.workinjury.redisite.consent.presenter;
import org.jdeferred.Promise;

import patient.telehealth.redimed.workinjury.views.SignaturePad;


/**
 * Created by MeditekMini on 6/16/16.
 */
public interface IConsentPresenter {

    void uploadSignature(SignaturePad signaturePad);

    Promise submitRedisite();

}
