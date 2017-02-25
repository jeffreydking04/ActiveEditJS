class ActiveEdit
  constructor: (@config) ->
    @element = document.querySelectorAll(@config.element || '#activeedit')[0]
    @headers = []
    @rows = []
    @cols = []
    @source = @config.rows
    @redCells = []
    @activeCells = []
    @copiedCells = []
    @copiedValues = []
    @selectionStart = null
    @selectionEnd = null
    @selectedCol = null
    @openCell = null
    @state = "ready"
    @mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    @topOffset = if not @config.topOffset then 0 else @config.topOffset
    @cellStyles =
      activeColor: "#FFE16F"
      uneditableColor: "#FFBBB3"
    if @config.custom
      @set key, value for key, value of @config.custom when key of @config.custom
      delete @config.custom
    do @init if @config.initialize
    @contextMenu = new ContextMenu ['cut', 'copy', 'paste', 'undo', 'fill'], @
  init: ->
    do @config.beforeInit if @config.beforeInit
    do @build
    do @events
    do @render
    do @config.afterInit if @config.afterInit
    return
  build: ->
    # Build Table Header
    tr = document.createElement 'tr'
    for colAttributes, i in @config.cols
      col = new Column(colAttributes, @)
      @cols.push col
      tr.appendChild col.element
    thead = document.createElement 'thead'
    thead.appendChild tr

    # Build Table Body
    tbody = document.createElement 'tbody'
    for rowAttributes, i in @source
      row = new Row rowAttributes, @
      @rows.push row
      tbody.appendChild row.element

    #Build Table
    table = document.createElement 'table'
    Utilities::setAttributes table, {id: 'editable-grid', class: @config.tableClass}
    table.appendChild thead
    table.appendChild tbody
    @tableEl = table
#  rebuild: (newConfig=null) ->
#    config = Object.create @config
#    if newConfig isnt null
#      for option of newConfig
#        if newConfig[option] then config[option] = newConfig[option]
#    do @destroy
#    @constructor config
  events: ->
    table = @
    moveTo = table.moveTo
    edit = table.edit
    document.onkeydown = (e) ->
      if table.activeCell()
        key = e.keyCode
        shift = e.shiftKey
        ctrl = e.ctrlKey
        cmd = e.metaKey
        valueFromKey = (key, shift) ->
          char = String.fromCharCode key
          if not shift then char.toLowerCase() else char
        openCellAndPopulateInitialValue = -> if not table.openCell then table.activeCell().showControl(valueFromKey key, shift)
        switch key
          when 39 # right arrow
            if not table.activeCell().isBeingEdited()
              moveTo table.nextCell()
          when 9
            if shift then moveTo table.previousCell() else moveTo table.nextCell()
          when 37 then moveTo table.previousCell()
          when 38 then moveTo table.aboveCell()
          when 40 then moveTo table.belowCell()
          when 32 # space
            if not table.openCell then edit table.activeCell()
          when 67
            if cmd or ctrl then table.contextMenu.copy() else openCellAndPopulateInitialValue()
          when 86
            if cmd or ctrl then table.contextMenu.paste() else openCellAndPopulateInitialValue()
          when 88
            if cmd or ctrl then table.contextMenu.cut() else openCellAndPopulateInitialValue()
          when 90
            if cmd or ctrl then table.contextMenu.undo() else openCellAndPopulateInitialValue()
          when 13 then break
          when 16 then break
          when 17 then break
          when 91 then break
          when 8
            if not table.openCell
              e.preventDefault()
              table.delete()
          when 46
            if not table.openCell
              e.preventDefault()
              table.delete()
          else
            key = key-48 if key in [96..111] # For numpad
            openCellAndPopulateInitialValue()
    window.onresize = -> Utilities::setStyles table.openCell.control, table.openCell.position() if table.openCell
    window.onscroll = -> table.openCell.reposition() if table.openCell
    @tableEl.oncontextmenu = (e) -> false
    document.onclick = (e) -> Utilities::clearActiveCells table unless (table.isDescendant e.target) or (e.target is table.activeCell()?.control)
#  render: ->
#    @element = document.querySelectorAll(@config.element || '#gridedit')[0] if @element.hasChildNodes()
#    @element.appendChild @tableEl
  set: (key, value) -> @config[key] = value if key isnt undefined
#  getCell: (x, y) -> @rows[x].cells[y]
#  activeCell: -> if @activeCells.length > 1 then @activeCells else @activeCells[0]
#  nextCell: -> @activeCell()?.next()
#  previousCell: -> @activeCell()?.previous()
#  aboveCell: -> @activeCell()?.above()
#  belowCell: -> @activeCell()?.below()
#  moveTo: (toCell, fromCell) ->
#    if toCell
#      fromCell = toCell.table.activeCell() if fromCell is undefined
#      direction = toCell.table.getDirection(fromCell, toCell)
#      beforeCellNavigateReturnVal = toCell.beforeNavigateTo(toCell, fromCell, direction) if toCell.beforeNavigateTo
#      if beforeCellNavigateReturnVal isnt false
#        if not toCell.isVisible()
#          oldY = toCell.table.activeCell().address[0]
#          newY = toCell.address[0]
#          directionModifier = 1
#          if newY < oldY # Then going up - This is because you need -1 for scrolling up to work properly
#            directionModifier = -1
#          window.scrollBy(0, toCell?.position().height * directionModifier)
#        do toCell.makeActive
#    false
#  getDirection: (fromCell, toCell) ->
#    fromAddressY = fromCell.address[0]
#    toAddressY = toCell.address[0]
#    fromAddressX = fromCell.address[1]
#    toAddressX = toCell.address[1]
#    if fromAddressY is toAddressY # Going right or left
#      if fromAddressX > toAddressX # Going Left
#        direction = "left"
#      else if fromAddressX < toAddressX # Going Right
#        direction = "right"
#      else
#        console.log("Cannot calculate direction going from cell #{fromCell.address} to cell #{toCell.address}")
#    else if fromAddressY > toAddressY # Going Up
#      direction = "up"
#    else if fromAddressY < toAddressY # Going Down
#      direction = "down"
#    else
#      console.log("Cannot calculate direction going from cell #{fromCell.address} to cell #{toCell.address}")
#    direction
#  edit: (cell, newValue=null) ->
#    if newValue isnt null
#      cell?.edit newValue
#    else
#      do cell?.edit
#      false
#  delete: ->
#    for cell in @activeCells
#      cell.value('')
#  clearActiveCells: -> Utilities::clearActiveCells @
#  setSelection: ->
#    if @selectionStart isnt @selectionEnd
#      do cell.removeFromSelection for cell in @activeCells
#      @activeCells = []
#      rowRange = [@selectionStart.address[0]..@selectionEnd.address[0]]
#      colRange = [@selectionStart.address[1]..@selectionEnd.address[1]]
#      for row in rowRange
#        @rows[row].cells[col].addToSelection() for col in colRange
#      return
#  data: ->
#    data = []
#    for row in @rows
#      rowData = []
#      for cell in row.cells
#        rowData.push if cell.type is 'date' then cell.control.valueAsDate else cell.value()
#      data.push rowData
#    data
#  repopulate: ->
#    for row in @rows
#      for cell in row.cells
#        cell.value(cell.source[cell.valueKey])
#  destroy: ->
#    @element.removeChild @tableEl
#    for key of @
#      delete @[key]
#  isDescendant: (child) ->
#    node = child.parentNode
#    while node?
#      return true if node is @tableEl
#      node = node.parentNode
#    false