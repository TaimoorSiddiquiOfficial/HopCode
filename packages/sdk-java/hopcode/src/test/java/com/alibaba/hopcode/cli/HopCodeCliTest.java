package com.alibaba.hopcode.cli;

import java.util.List;

import com.alibaba.hopcode.cli.transport.TransportOptions;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.*;

class HopCodeCliTest {

    private static final Logger log = LoggerFactory.getLogger(HopCodeCliTest.class);
    @Test
    void simpleQuery() {
        List<String> result = HopCodeCli.simpleQuery("hello world");
        log.info("simpleQuery result: {}", result);
        assertNotNull(result);
    }

    @Test
    void simpleQueryWithModel() {
        List<String> result = HopCodeCli.simpleQuery("hello world", new TransportOptions().setModel("qwen-plus"));
        log.info("simpleQueryWithModel result: {}", result);
        assertNotNull(result);
    }
}
