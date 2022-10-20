package com.example.wordsserver.controller;

import com.example.wordsserver.entity.Answer;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.security.MessageDigest;

@RestController
public class indexPostController {
    @PostMapping("/submit")
    public String indexPostController(@RequestBody Answer[] answerArray) throws Exception{
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream out = null;
        try {
            out = new ObjectOutputStream(bos);
            out.writeObject(answerArray);
            out.flush();
            byte[] answerArrayByte = bos.toByteArray();
            String md5=MD5(answerArrayByte);
            return md5.equals("a890133d206f9f5a7b0ec3710efe898d")?
                    "TSCTF-J{nauty_or_diligent____which_type_you_are^_^}":
                    "好像没有全对哦";
        } finally {
            try {
                bos.close();
            } catch (IOException e) {
                e.printStackTrace();
                return e.toString();
            }
        }
    }
    public String MD5(byte[] in) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] array = md.digest(in);
            StringBuffer sb = new StringBuffer();
            for (int i = 0; i < array.length; ++i) {
                sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1,3));
            }
            return sb.toString();
        } catch (java.security.NoSuchAlgorithmException e) {
        }
        return null;
    }
}
