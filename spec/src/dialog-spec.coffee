describe "initialize", ->
  it "should get location.href when without param", ->
    url = simple.url()
    expect(url.toString()).toEqual(location.href)



describe "protocol", ->
  it "should get empty string when no protocol", ->
    url = simple.url("//tower.im/")
    expect(url.protocol).toEqual("")

  it "should get empty string when no protocol and double slash", ->
    url = simple.url("tower.im")
    expect(url.protocol).toEqual("")


  it "should get right protocol when protocol appare", ->
    url = simple.url("ftp://tower.im")
    expect(url.protocol).toEqual("ftp:")



describe "host", ->
  it "should get empty string when only path", ->
    url = simple.url("/project/123")
    expect(url.host).toEqual("")


  it "should get right host when it is a root url", ->
    url = simple.url("http://tower.im/")
    expect(url.host).toEqual("tower.im")


  it "should get right host when it is a bare host", ->
    url = simple.url("tower.im")
    expect(url.host).toEqual("tower.im")


  it "should get right host when it is with path", ->
    url = simple.url("tower.im/project/123")
    expect(url.host).toEqual("tower.im")


  it "should get right host when it is just ip address", ->
    url = simple.url("http://192.168.0.1")
    expect(url.host).toEqual("192.168.0.1")



describe "port", ->
  it "should get empty string when port is default and not appare", ->
    url = simple.url("http://tower.im/project/123")
    expect(url.port).toEqual("")


  it "should get right string when port appare", ->
    url = simple.url("http://tower.im:80/project/123")
    expect(url.port).toEqual("80")



describe "pathname", ->
  it "should get empty string when only search", ->
    url = simple.url("?a=1")
    expect(url.pathname).toEqual("")


  it "should get right string when just a path", ->
    url = simple.url("/project/123?a=1")
    expect(url.pathname).toEqual("/project/123")


  it "should get right string when it is relative path", ->
    url = simple.url("project/123")
    expect(url.pathname).toEqual("/123")



  it "should get right string when it is a root path", ->
    url = simple.url("tower.im")
    expect(url.pathname).toEqual("")


  it "should get right string when it is a root path with slash", ->
    url = simple.url("http://tower.im/")
    expect(url.pathname).toEqual("/")



describe "search and hash", ->
  it "should get empty string when no search and hash", ->
    url = simple.url("http://tower.im/")
    expect(url.search).toEqual({})
    expect(url.hash).toEqual("")


  it "should get right search and hash when it has", ->
    url = simple.url("http://tower.im/?a=1&b=2#20130303")
    expect(url.search).toEqual({a: "1", b: "2"})
    expect(url.hash).toEqual("20130303")


  it "should get empty string when search value is nothing", ->
    url = simple.url("http://tower.im/?a=")
    expect(url.search).toEqual({a: ""})


  it "should get right string when use getParam", ->
    url = simple.url("http://tower.im/?a=1&b=2")
    expect(url.getParam('b')).toEqual("2")
    expect(url.getParam('c')).toBeUndefined()


  it "should set right search when search is empty string", ->
    url = simple.url("http://tower.im/")
    url.setParam("a", 1)
    url.setParam({b: 2, c: 3})
    expect(url.search).toEqual({a: "1", b: "2", c: "3"})


  it "should get undefined after removeParam", ->
    url = simple.url("http://tower.im/?a=1&b=2")
    url.removeParam("a")
    expect(url.search).toEqual({b: "2"})
    url.removeParam("b")
    expect(url.search).toEqual({})



describe "toString", ->
  it "should get right string", ->
    str = "http://tower.im:8080/project/123?a=1&b=2#20120101"
    url = simple.url(str)
    expect(url.toString()).toEqual(str)

    str = "tower.im/project/123?a=1&b=2#20120101"
    url = simple.url(str)
    expect(url.toString()).toEqual(str)

    str = "/project/123?a=1&b=2#20120101"
    url = simple.url(str)
    expect(url.toString()).toEqual(str)

    str = "/project/123#20120101"
    url = simple.url(str)
    expect(url.toString()).toEqual(str)


  it "should get right string when request relative", ->
    str = "http://tower.im:8080/project/123?a=1&b=2#20120101"
    url = simple.url(str)
    expect(url.toString("relative")).toEqual("/project/123?a=1&b=2#20120101")

    str = "tower.im/project/123?a=1&b=2#20120101"
    url = simple.url(str)
    expect(url.toString("relative")).toEqual("/project/123?a=1&b=2#20120101")

    str = "/project/123?a=1&b=2#20120101"
    url = simple.url(str)
    expect(url.toString("relative")).toEqual(str)

    str = "/project"
    url = simple.url(str)
    expect(url.toString("relative")).toEqual(str)


  it "should get empty string if request type is not absolute or relative", ->
    str = "/project"
    url = simple.url(str)
    expect(url.toString("fuck")).toEqual("")
