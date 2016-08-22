package patient.telehealth.redimed.workinjury.redisite.image.presenter;

import android.net.Uri;

import java.util.ArrayList;

import patient.telehealth.redimed.workinjury.model.CustomGallery;

/**
 * Created by MeditekPro on 6/30/16.
 */
public interface IImagePresenter {

    Uri getOutputMediaFileUri(int type);

    ArrayList<CustomGallery> setImageGallery(String[] allPath);
}
