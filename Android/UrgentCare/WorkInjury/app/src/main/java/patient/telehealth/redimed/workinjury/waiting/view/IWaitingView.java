package patient.telehealth.redimed.workinjury.waiting.view;

import android.content.Intent;
import android.graphics.Bitmap;

/**
 * Created by Fox on 1/21/2016.
 */
public interface IWaitingView {
    void onLoadNameCaller(String name);
    void onLoadAvatar(Bitmap bitmap);
    void onResultDecline();
    void onResultAnswer(Intent intent);
}
