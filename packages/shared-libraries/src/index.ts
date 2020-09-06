// Remember to update the following places when introducing more shared libraries:
// - libraries.json
// - libraries-alias.json
// - index.d.ts if additional types are available

export default function asyncImportAll() {
  import('@umijs/hooks')
  import('antd')
  import('axios')
  import('d3')
  import('dayjs')
  import('lodash')
  import('office-ui-fabric-react/lib/DetailsList')
  import('office-ui-fabric-react/lib/Selection')
  import('office-ui-fabric-react/lib/ScrollablePane')
  import('office-ui-fabric-react/lib/Sticky')
  import('office-ui-fabric-react/lib/MarqueeSelection')
  import('office-ui-fabric-react/lib/Utilities')
  import('react')
  import('react-copy-to-clipboard')
  import('react-dom')
  import('react-router')
  import('react-router-dom')
}
