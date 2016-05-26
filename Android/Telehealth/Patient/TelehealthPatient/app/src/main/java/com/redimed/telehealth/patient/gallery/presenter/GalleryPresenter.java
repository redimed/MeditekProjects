package com.redimed.telehealth.patient.gallery.presenter;

import android.content.Context;
import android.database.Cursor;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.provider.MediaStore;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;

import com.redimed.telehealth.patient.R;
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
    private AppCompatActivity activity;

    public GalleryPresenter(Context context, IGalleryView iGalleryView, AppCompatActivity appCompatActivity) {
        this.context = context;
        this.iGalleryView = iGalleryView;
        this.activity = appCompatActivity;

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
    public void initToolbar(Toolbar toolbar) {
        //init toolbar
        AppCompatActivity appCompatActivity =  activity;
        appCompatActivity.setSupportActionBar(toolbar);

        ActionBar actionBar = appCompatActivity.getSupportActionBar();
        if (actionBar != null) {
            actionBar.setHomeButtonEnabled(true);
            actionBar.setTitle(context.getResources().getString(R.string.title_gallery));

            actionBar.setDisplayShowHomeEnabled(true); // show or hide the default home button
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowCustomEnabled(true); // enable overriding the default toolbar layout
            actionBar.setDisplayShowTitleEnabled(true); // disable the default title element here (for centered title)

            // Change color image back, set a custom icon for the default home button
            final Drawable upArrow = ContextCompat.getDrawable(context, R.drawable.abc_ic_ab_back_mtrl_am_alpha);
            upArrow.setColorFilter(ContextCompat.getColor(context, R.color.lightFont), PorterDuff.Mode.SRC_ATOP);
            actionBar.setHomeAsUpIndicator(upArrow);
        }
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
