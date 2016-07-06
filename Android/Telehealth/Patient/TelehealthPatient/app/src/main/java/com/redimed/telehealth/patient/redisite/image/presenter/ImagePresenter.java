package com.redimed.telehealth.patient.redisite.image.presenter;

import android.content.Context;
import android.net.Uri;
import android.os.Environment;
import android.support.v4.app.FragmentActivity;

import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.redisite.image.view.IImageView;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;

/**
 * Created by MeditekPro on 6/30/16.
 */
public class ImagePresenter implements IImagePresenter {

    private Context context;
    private IImageView iImageView;
    private FragmentActivity activity;
    private static final int MEDIA_TYPE_IMAGE = 1;


    public ImagePresenter(Context context, IImageView iImageView, FragmentActivity activity) {
        this.context = context;
        this.activity = activity;
        this.iImageView = iImageView;
    }

    private static File getOutputMediaFile(int type) {
        // Create a media file name
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
        File mediaFile = null;

        // External sdcard location
        File mediaStorageDir = new File(Environment.getExternalStorageDirectory(), "Telehealth");
        // Create the storage directory if it does not exist
        if (!mediaStorageDir.exists()) {
            if (!mediaStorageDir.mkdirs()) {
                mediaStorageDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM);
                mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
                return mediaFile;
            }
        }

        if (type == MEDIA_TYPE_IMAGE) {
            mediaFile = new File(mediaStorageDir.getPath() + File.separator + "IMG_" + timeStamp + ".jpg");
        } else {
            return null;
        }
        return mediaFile;
    }

    @Override
    public Uri getOutputMediaFileUri(int type) {
       return Uri.fromFile(getOutputMediaFile(type));
    }

    @Override
    public void setImageGallery(String[] allPath) {
        ArrayList<CustomGallery> dataT = new ArrayList<>();
        for (String string : allPath) {
            CustomGallery item = new CustomGallery();
            item.sdcardPath = string;
            dataT.add(item);
        }
        iImageView.onLoadGallery(dataT);
    }
}
