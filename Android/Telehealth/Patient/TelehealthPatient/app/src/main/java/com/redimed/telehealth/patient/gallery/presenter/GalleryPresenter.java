package com.redimed.telehealth.patient.gallery.presenter;

import android.content.Context;
import android.database.Cursor;
import android.provider.MediaStore;

import com.redimed.telehealth.patient.gallery.view.IGalleryView;
import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.utlis.AdapterGallery;

import java.util.ArrayList;
import java.util.Collections;

/**
 * Created by Fox on 1/25/2016.
 */
public class GalleryPresenter implements IGalleryPresenter {

    private Context context;
    private Cursor imageCursor;
    private IGalleryView iGalleryView;

    public GalleryPresenter(Context context, IGalleryView iGalleryView) {
        this.context = context;
        this.iGalleryView = iGalleryView;

        iGalleryView.onLoadToolbar();
    }

    @Override
    public ArrayList<CustomGallery> getGalleryPhotos() {
        ArrayList<CustomGallery> galleryList = new ArrayList<CustomGallery>();
        try {
            final String[] columns = {MediaStore.Images.Media.DATA, MediaStore.Images.Media._ID};
            final String orderBy = MediaStore.Images.Media._ID;

            imageCursor = context.getContentResolver().query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, columns, null, null, orderBy);

            if (imageCursor != null && imageCursor.getCount() > 0) {
                while (imageCursor.moveToNext()) {
                    CustomGallery item = new CustomGallery();
                    int dataColumnIndex = imageCursor.getColumnIndex(MediaStore.Images.Media.DATA);
                    item.sdcardPath = imageCursor.getString(dataColumnIndex);
                    galleryList.add(item);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            imageCursor.close();
        }

        // show newest photo at beginning of the list
        Collections.reverse(galleryList);
        return galleryList;
    }

    @Override
    public void selectedImages(AdapterGallery adapter) {
        ArrayList<CustomGallery> selected = adapter.getSelected();
        String[] allPath = new String[selected.size()];
        for (int i = 0; i < allPath.length; i++) {
            allPath[i] = selected.get(i).sdcardPath;
        }
        iGalleryView.onLoadPath(allPath);
    }
}
