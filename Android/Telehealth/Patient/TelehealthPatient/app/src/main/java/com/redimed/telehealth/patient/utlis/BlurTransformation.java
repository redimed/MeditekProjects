package com.redimed.telehealth.patient.utlis;

import android.content.Context;
import android.graphics.Bitmap;
import android.support.v8.renderscript.Allocation;
import android.support.v8.renderscript.Element;
import android.support.v8.renderscript.RenderScript;
import android.support.v8.renderscript.ScriptIntrinsicBlur;

import com.bumptech.glide.load.engine.bitmap_recycle.BitmapPool;
import com.bumptech.glide.load.resource.bitmap.BitmapTransformation;

public class BlurTransformation extends BitmapTransformation {

    private RenderScript rs;
    /**
     * Max blur radius supported by the Renderscript library
     **/
    protected static final int MAX_RADIUS = 25;
    /**
     * Min blur radius supported by the Renderscript library
     **/
    protected static final int MIN_RADIUS = 1;
    /**
     * Selected radius
     **/
    protected final int radius;

    /**
     * Creates a new Blur transformation
     *
     * @param context Application context to instantiate the Renderscript
     **/

    public BlurTransformation(Context context, int radius) {
        super(context);
        this.radius = radius < MIN_RADIUS ? MIN_RADIUS :
                radius > MAX_RADIUS ? MAX_RADIUS : radius;
        rs = RenderScript.create(context);
    }

    @Override
    protected Bitmap transform(BitmapPool pool, Bitmap toTransform, int outWidth, int outHeight) {
        Bitmap blurredBitmap = toTransform.copy(Bitmap.Config.ARGB_8888, true);

        // Allocate memory for Renderscript to work with
        Allocation input = Allocation.createFromBitmap(
                rs,
                blurredBitmap,
                Allocation.MipmapControl.MIPMAP_FULL,
                Allocation.USAGE_SHARED
        );
        Allocation output = Allocation.createTyped(rs, input.getType());

        // Load up an instance of the specific script that we want to use.
        ScriptIntrinsicBlur script = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
        script.setInput(input);

        // Set the blur radius
        script.setRadius(radius);

        // Start the ScriptIntrinisicBlur
        script.forEach(output);

        // Copy the output to the blurred bitmap
        output.copyTo(blurredBitmap);

        toTransform.recycle();

        return blurredBitmap;
    }

    @Override
    public String getId() {
        return "blur";
    }
}