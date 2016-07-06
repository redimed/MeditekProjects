package com.redimed.telehealth.patient.redisite.image.view;

import com.redimed.telehealth.patient.models.CustomGallery;

import java.util.ArrayList;

/**
 * Created by MeditekPro on 6/30/16.
 */
public interface IImageView {

    void onLoadGallery(ArrayList<CustomGallery> customGalleries);
}
