package com.redimed.telehealth.patient.gallery.presenter;

import com.redimed.telehealth.patient.models.CustomGallery;
import com.redimed.telehealth.patient.utlis.AdapterGallery;

import java.util.ArrayList;

/**
 * Created by Fox on 1/25/2016.
 */
public interface IGalleryPresenter {
    ArrayList<CustomGallery> getGalleryPhotos();
    void selectedImages(AdapterGallery adapter);
}
