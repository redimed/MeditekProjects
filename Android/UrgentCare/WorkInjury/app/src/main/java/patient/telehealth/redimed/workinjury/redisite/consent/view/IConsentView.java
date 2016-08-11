package patient.telehealth.redimed.workinjury.redisite.consent.view;

import android.graphics.Bitmap;

/**
 * Created by MeditekMini on 6/16/16.
 */
public interface IConsentView {

    void onLoadError(String msg);

    void onLoadImgSignature(Bitmap bitmap);

}
