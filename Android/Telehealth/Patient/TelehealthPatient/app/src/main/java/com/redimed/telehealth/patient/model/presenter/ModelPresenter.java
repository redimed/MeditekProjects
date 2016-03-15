package com.redimed.telehealth.patient.model.presenter;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.widget.ProgressBar;

import com.redimed.telehealth.patient.model.view.IModelView;
import com.redimed.telehealth.patient.utlis.UploadFileModel;

/**
 * Created by Fox on 1/20/2016.
 */
public class ModelPresenter implements IModelPresenter {

    private Context context;
    private IModelView iModelView;
    private String TAG = "=====MODEL_PRESENTER=====";

    public ModelPresenter(Context context, IModelView iModelView) {
        this.context = context;
        this.iModelView = iModelView;
    }

    @Override
    public void getScaledBitmap(Bitmap bm, int rotation) {
        int width = bm.getWidth();
        int height = bm.getHeight();
        int newWidth = 1000, newHeight = 800;
        float scaleWidth = ((float) newWidth) / width;
        float scaleHeight = ((float) newHeight) / height;
        // CREATE A MATRIX FOR THE MANIPULATION
        Matrix matrix = new Matrix();
        // RESIZE THE BITMAP
        matrix.postScale(scaleWidth, scaleHeight);
        if (rotation % 360 == 0) {
            bm = Bitmap.createBitmap(bm, 0, 0, width, height, matrix, false);
        } else {
            // ROTATE THE BITMAP
            matrix.postRotate(rotation);
            bm = Bitmap.createBitmap(bm, 0, 0, width, height, matrix, false);
        }
        iModelView.onLoadImage(bm);
    }

    @Override
    public void uploadProgress(ProgressBar progressBar, String picturePath, String appointmentUID, String bodyPart, SharedPreferences uidTelehealth, IModelView iModelView) {
        new UploadFileModel(progressBar, picturePath, appointmentUID, bodyPart, uidTelehealth, iModelView).execute();
    }
}
