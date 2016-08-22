package patient.telehealth.redimed.workinjury.call.view;

import android.view.View;

import com.opentok.android.Publisher;
import com.opentok.android.Subscriber;

/**
 * Created by Fox on 1/21/2016.
 */
public interface ICallView {
    void onLoadTimer(String timer);
    void onLoadNameCaller(String name);

    void onSocketSuccess();
    void onLoadProgress(int viewId);

    //Initialize view Publisher (Patient)
    void onAttachPublisherView(Publisher publisher);

    //Initialize view Subscriber (Clinic)
    void onAttachSubscriberView(Subscriber subscriber);

    //Remove view when disconnected
    void onRemoveView(String viewer, View view);

    void onMuteSubscriber(int drawable);
    void onMutePublisher(int drawable);
    void onEndCommunication();
}
