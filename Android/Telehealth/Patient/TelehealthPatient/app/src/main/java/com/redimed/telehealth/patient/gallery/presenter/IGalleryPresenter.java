package com.redimed.telehealth.patient.gallery.presenter;

import android.support.v7.widget.Toolbar;

import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.adapter.GalleryAdapter;

import java.util.ArrayList;

/**
 * Created by Fox on 1/25/2016.
 */
public interface IGalleryPresenter {

    void initToolbar(Toolbar toolbar);

    void selectedImages(GalleryAdapter adapter);

    ArrayList<CustomGallery> getGalleryPhotos();

}
