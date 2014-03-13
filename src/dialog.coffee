class Url
  constructor: (url) ->
    url ||= location.toString()
    return null unless url

    @_url = url
    @protocol = ""
    @host = ""
    @port = ""
    @pathname = ""
    @search = {}
    @hash = ""

    url = url.split("//")

    if url.length is 1
      url = url[0]
    else
      @protocol = url[0]
      url = url[1]

    arr = url.split("/")
    host = arr[0].split(":")
    @host = host[0]

    if host.length > 1
      @port = host[1]

    if arr.length > 1
      prefix = "/"
    else
      prefix = ""

    @pathname = "#{ prefix }#{ arr.slice(1, arr.length).join('/').split('?')[0].split('#')[0] }"
    @hash = url.split("#")[1] || ""
    @search = Url.parseParams (url.split("?")[1] || "").split("#")[0]


  @parseParams: (str) ->
    obj = {}

    for param in str.split('&')
      [k, v] = param.split('=')
      obj[k] = v if k

    obj


  @serializeParams: (obj) ->
    return "" unless obj
    ([k, v].join('=') for k, v of obj).join('&')


  # @isEmptyObj: (obj) ->
  #   for k, v of obj
  #     if obj.hasOwnProperty(k)
  #       return false

  #   true


  toString: (type="absolute") ->
    url = ""

    return url unless /absolute|relative/.test(type)

    if type is "absolute"
      if @protocol
        url += "#{ @protocol }//"

      if @host
        url += "#{ @host }"

      if @port
        url += ":#{ @port }"

    url += @pathname

    search = Url.serializeParams(@search)
    if search
      url += "?#{ search }"

    if @hash
      url += "##{ @hash }"

    url


  setParam: () ->
    args = arguments

    if args.length is 1 and typeof args[0] is "object"
      obj = args[0]
    else if args.length is 2
      obj = {}
      obj[args[0].toString()] = args[1].toString()
    else
      return false

    @search ||= {}

    for k, v of obj
      @search[k.toString()] = v.toString()

    @search


  getParam: (name) ->
    @search[name]


  removeParam: (name) ->
    delete @search[name]



@simple = {} unless @simple

@simple.url = (url) ->
  new Url(url)
