package com.redimed.telehealth.patient.redisite.consent.presenter;

import android.os.Bundle;

import com.redimed.telehealth.patient.views.SignaturePad;

/**
 * Created by MeditekMini on 6/16/16.
 */
public interface IConsentPresenter {

    void uploadSignature(String path);

    void submitRedisite(String supervisorName, Bundle bundle);

    void saveSignature(SignaturePad signaturePad);

}
