package com.redimed.telehealth.patient.call.presenter;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;

/**
 * Created by Fox on 1/21/2016.
 */
public interface ICallPresenter {
    void listenSocket(Intent intent);
    void socketConnection();
    void holdCommunication();
    void mutePublisher();
    void muteSubscriber();
    void endCommunication();
}
