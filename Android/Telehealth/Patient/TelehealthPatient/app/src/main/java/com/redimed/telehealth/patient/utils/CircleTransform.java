package com.redimed.telehealth.patient.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import com.squareup.picasso.Transformation;

/**
 * Created by Lam on 10/28/2015.
 */
public class CircleTransform implements Transformation {

    @Override
    public Bitmap transform(Bitmap source) {
        if (source == null){
            source.recycle();
            return null;
        }

        int size = Math.min(source.getWidth(), source.getHeight());
        int x = (source.getWidth() - size) / 2;
        int y = (source.getHeight() - size) / 2;
        float r = size/2f;

        Bitmap squaredBitmap = Bitmap.createBitmap(source, x, y, size, size);
        if (squaredBitmap != source){source.recycle();}

        Bitmap bitmap = Bitmap.createBitmap(size, size, source.getConfig());
        BitmapShader shader = new BitmapShader(squaredBitmap, BitmapShader.TileMode.CLAMP, BitmapShader.TileMode.CLAMP);

        Paint paint = new Paint();
        paint.setShader(shader);
        paint.setAntiAlias(true);
        paint.setFilterBitmap(true);
        paint.setColor(Color.BLUE);

        Canvas canvas = new Canvas(bitmap);
        canvas.drawCircle(r, r, r, paint);
        squaredBitmap.recycle();

        return bitmap;
    }

    @Override
    public String key() {
        return getClass().getName();
    }
}
