package patient.telehealth.redimed.workinjury.call.presenter;

import android.content.Intent;

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
