package com.yishua.hbxxl.event;

public class CCEvent {
    public int type;
    public String param;

    public CCEvent(int type, String param) {
        this.type = type;
        this.param = param;
    }
}
