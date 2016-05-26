package com.redimed.telehealth.patient.waiting.presenter;

import android.content.Intent;

/**
 * Created by Fox on 1/21/2016.
 */
public interface IWaitingPresenter {
    void listenSocket(Intent intent);
    void playRingTone();
    void stopRingTone();
    void declineCall();
    void answerCall();
}
